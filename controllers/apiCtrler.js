module.exports.ProcessDataFromEdge = function (req, res) {
    console.log(req.body);
    console.log(req.files);

    listPlate = req.body.listPlate;

    if (typeof (listPlate) == "string")
        CheckPlateAndCreateDocument(listPlate);
    else
        listPlate.forEach(plate => {
            CheckPlateAndCreateDocument(plate);
        });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end("done");
}

function CheckPlateAndCreateDocument(plate) {

}