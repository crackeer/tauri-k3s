import Database from '@tauri-apps/plugin-sql';

const getSQLite = async () => {
    return await Database.load('sqlite:k3s.db');
}

export default {
    getSQLite,
    getClusters : async () => {
        let db = await getSQLite();
        let result = await db.select("SELECT * FROM cluster_server where cluster_id = ''");
        return result
    },
    createClusterServer : async (data) => {
        let db = await getSQLite();
        let clusterId = '';
        if (data['cluster_id'] != undefined) {
            clusterId = data['cluster_id'];
        }
        if (data['name'] == undefined) {
            data['name'] = ''
        }
        let result = await db.execute("INSERT INTO cluster_server (name, cluster_id, server, user, password, port) VALUES ($1, $2, $3, $4, $5, $6)", [data.name, clusterId, data.server, data.user, data.password, data.port]);
        return result
    },
    getClusterNodes : async (id) => {
        let db = await getSQLite();
        let result = await db.select("SELECT * FROM cluster_server where cluster_id = $1", [id +'']);
        console.log("getClusterNodes", result, id)
        return result
    },
    deleteCluster : async (id) => {
        let db = await getSQLite();
        let result = await db.execute("DELETE FROM cluster_server where cluster_id = $1", [id +'']);
        let result2 = await db.execute("DELETE FROM cluster_server where id = $1", [id +'']);
        return result
    },
    deleteClusterServer : async (id) => {
        let db = await getSQLite();
        let result = await db.execute("DELETE FROM cluster_server where id = $1", [id +'']);
        return result
    }
}