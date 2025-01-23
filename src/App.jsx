import React, { useEffect, useState } from "react";
import {IconPlus} from "@arco-design/web-react/icon"
import { Modal, Card, Button, Form, Input, Divider, Grid, Affix, Message } from "@arco-design/web-react"
import sqlite from "./sqlite";
import dayjs from "dayjs";
import lodash from "lodash";
const FormItem = Form.Item;
const Row = Grid.Row;
const Col = Grid.Col;
function AddClusterModal({ visible, setVisible, callback }) {
    const [selfVisible, setSelfVisible] = useState(visible)
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue({
            name: "cluster" + dayjs().format("YYYYMMDDHHmm"),
            server: "",
            user: "root",
            password: "",
            port: "22",
        })
        setSelfVisible(visible)
    }, [visible])
    var doAddServer = async () => {
        let data = form.getFieldsValue()
        let result = await sqlite.createClusterServer(data)
        Message.success("添加成功")
        callback()
        setSelfVisible(false)
        setVisible(false)
    }
    return <Modal visible={selfVisible} title="新建集群" onCancel={() => {
        setSelfVisible(false)
        setVisible(false)
    }} style={{ width: '60%' }} onConfirm={doAddServer}>
        <Form autoComplete="off" form={form}>
            <FormItem label="名字" field="name"><Input placeholder="名字" /></FormItem>
            <FormItem label="服务器IP" field="server"><Input placeholder="服务器IP" /></FormItem>
            <FormItem label="用户" field="user"><Input placeholder="用户" /></FormItem>
            <FormItem label="密码" field="password"><Input placeholder="密码" type="password" /></FormItem>
            <FormItem label="端口" field="port"><Input placeholder="端口" /></FormItem>
        </Form>
    </Modal>
}

function AddServerModal({ visible, setVisible, clusterId, callback }) {
    const [selfVisible, setSelfVisible] = useState(visible)
    const [form] = Form.useForm();
    useEffect(() => {
        setSelfVisible(visible)
        console.log("AddServerModal Init", clusterId)
        form.setFieldsValue({
            server: "",
            user: "root",
            password: "",
            port: "22",
        })
    }, [visible, clusterId])
    var doAddServer = async () => {
        let data = form.getFieldsValue()
        data["cluster_id"] = clusterId + ''
        console.log("AddServerModal", data, clusterId)
        let result = await sqlite.createClusterServer(data)
        Message.success("添加成功")
        callback()
        setSelfVisible(false)
        setVisible(false)

    }
    return <Modal visible={selfVisible} title="加入集群" onCancel={() => {
        setSelfVisible(false)
        setVisible(false)
    }} style={{ width: '60%' }} onConfirm={doAddServer}>
        <Form autoComplete="off" form={form}>
            <FormItem label="服务器IP" field="server"><Input placeholder="服务器IP" /></FormItem>
            <FormItem label="用户" field="user"><Input placeholder="用户" /></FormItem>
            <FormItem label="密码" field="password"><Input placeholder="密码" type="password" /></FormItem>
            <FormItem label="端口" field="port"><Input placeholder="端口" /></FormItem>
            <FormItem label="集群ID" field="cluster_id" hidden></FormItem>
        </Form>
    </Modal>
}

export default function App() {
    const [clusters, setClusters] = useState([])
    const [visible1, setVisible1] = useState(false)
    const [visible2, setVisible2] = useState(false)
    const [currentClusterId, setCurrentClusterId] = useState("")
    useEffect(() => {
        getClusters()
    }, [])

    const getClusters = async () => {
        let result = await sqlite.getClusters()
        for (let i = 0; i < result.length; i++) {
            let tmp = await sqlite.getClusterNodes(result[i].id)
            let rootNode = lodash.cloneDeep(result[i])
            result[i]["node"] = [rootNode, ...tmp]
        }
        console.log("getClusters", result)
        setClusters(result)
    }
    const addCluster = () => {
        setVisible1(true)
    }
    const addServer = (data) => {
        console.log("addServer", data)
        setCurrentClusterId(data.id)
        setVisible2(true)
    }
    const deleteCluster = async (item) => {
        Modal.confirm({
            icon: null,
            title: '确认删除集群',
            content: '确认删除集群',
            onOk: async () => {
                let result = await sqlite.deleteCluster(item.id)
                Message.success("删除成功")
                getClusters()
            },
            onCancel: () => {
                console.log('Cancel');
            },
        });
    }

    const deleteClusterServer = async (item) => {
        Modal.confirm({
            icon: null,
            title: <div style={{textAlign: 'left'}}>确认删除服务器</div>,
            content: '确认删除服务器',
            onOk: async () => {
                let result = await sqlite.deleteClusterServer(item.id)
                Message.success("删除成功")
                getClusters()
            },
            onCancel: () => {
                
            }
        })
    }
    return <div style={{ padding: "5px 10px" }}>
        <Affix offsetTop={30} style={{right : '50px', position: 'fixed', zIndex : '999'}}>
            <Button type="primary" onClick={addCluster} shape='circle' icon={<IconPlus />}></Button>
        </Affix>

        {
            clusters.map((item, index) => {
                return <>
                    <h2>{item.name} (id: {item.id}) <small>
                        <Button type="text" size="small" onClick={deleteCluster.bind(this, item)}>删除集群</Button>
                    </small></h2>
                    <Divider>

                    </Divider>
                    <Row gutter={16}>
                        {
                            item.node.map((item1, index) => {
                                return <Col span={6} key={item1.id} style={{marginBottom:'10px'}}> <Card title={item1.server} extra={
                                    <Button type="text" size="small" onClick={deleteClusterServer.bind(this, item1)}>删除</Button>
                                }>
                                    <div>User：{item1.user}</div>
                                    <div>Password：{item1.password}</div>
                                    <div>Port：{item1.port}</div>
                                </Card></Col>
                            })
                        }
                        <Col span={6}>
                            <a onClick={addServer.bind(this,item)}><IconPlus style={{ fontSize: '80px', padding: '20px' }} /></a>
                        </Col>
                    </Row>
                </>
            })
        }
        <AddClusterModal visible={visible1} setVisible={setVisible1} callback={getClusters}/>
        <AddServerModal visible={visible2} setVisible={setVisible2} clusterId={currentClusterId} callback={getClusters}/>
    </div>
}