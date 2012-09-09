var app = require('express')()
    , server = require('http').createServer(app)
    , spawn = require('child_process').spawn;

server.listen(8084);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/df', function (req, res) {
    var df = spawn('df', ['-h']);
    var dfResult = "";
    
    df.stdout.on('data', function (data) {
        dfResult += ''+data.toString().replace('\n','\t');  
    });
  
    df.on('exit', function (code) {
        var dfResults = dfResult.toString().split('\t');
        var lines = dfResults[1].replace(/\n/gi,'\t').split('\t');

        var disks = new Array();
        var index;
        for(index = 0; index < lines.length-1; index++) {
            var vars = lines[index].split(' ');
            disks[index] = new Array();
            for(var i = 0; i < vars.length; i++) {
                if(vars[i] != '') {
                    disks[index].push(vars[i]);
                }
            }
        }
        res.json(disks);
    });
});
