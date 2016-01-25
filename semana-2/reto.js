var Hapi = require('hapi');
var Vision = require('vision');
var Path = require('path');
var server = new Hapi.Server();
var xml2js = require('xml2js')
var parser = new xml2js.Parser();
var http = require('http');

function get_steam_id(id64, estado){
    var X, Y , Z, steam_id = "";
    /*Para encontrar el steam_id la formular es :*/
    /*Z = (SteamID64 - 76561197960265728)  / 2
    Y = SteamID64 % 2
    X = 1 if profile is public / 0 if profile is private*/
    Z = (id64-76561197960265728)/2
    Y = id64 % 2
    if(estado==3){
        X = 0;
    }
    else{
        X = 1;
    }
    /*STEAM_X:Y:Z*/
    return "STEAM_"+X+":"+Y+":"+Z
}

server.connection({
    host: 'localhost',
    port: Number(process.argv[2] || 3000)
});

server.register(require('vision'), (err) => {

    server.views({
        engines: {
            html: require('handlebars')
        },
        path: Path.join(__dirname, 'templates')
    });
    server.route({
        method: "GET",
        path: "/",
        handler: function (request, reply){
            return reply.view('inicio');
        }
    });
    server.route({
        method: 'GET',
        path: '/steam/{nickname}',
        handler: function (request, reply) {
                var http = require("http");
                var nickname = request.params.nickname
                var url = "http://steamcommunity.com/id/"+nickname+"/?xml=1"
                http.get(url, function(response){
                    var data = ""
                    response.on("data", function(respuesta){
                        data += respuesta;
                    });
                    response.on('end', function () {
                        parser.parseString(data, function(err,result){
                           /* console.log(typeof(result["profile"]))*/
                            var perfil = result["profile"]
                            if(typeof(perfil) != "undefined") {
                                var steamid64 = perfil["steamID64"][0]
                                var estado = perfil["visibilityState"][0]
                                var avatar = perfil["avatarMedium"][0]
                                get_steam_id(steamid64, estado)
                                var variables = {
                                    nick: nickname,
                                    steam_id: get_steam_id(steamid64, estado),
                                    avatar: avatar
                                }
                                return reply.view('index', variables);
                            }
                            else{
                                return reply.view('error', variables);
                            }
                        })
                    });
                }).on('error', function(e) {
                  console.log("error")
                });
        }
    });
});
server.start(() => {
    console.log('Servidor corriendo en:', server.info.uri);
});

