module.exports.ProcessDataFromEdge = function (req, res) {
    console.log(req.body);
    console.log(req.files);
    res.writeHead(200, { 'Content-Type': 'application/json' }); 
    res.end("done");
}