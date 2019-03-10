const chai = require('chai');
const chaiHTTP = require('chai-http');
const server = require('../app');

const Maps = require('../models/maps');
const should = chai.should();

chai.use(chaiHTTP);

describe('maps', function () {

    beforeEach(function (done) {
        let maps = new Maps({
            title: "Museum Asia Afrika",
            lat: -6.921027,
            lng: 107.610027
        })
        maps.save(function (err) {
            done();
        })
    })

    afterEach(function (done) {
        Maps.collection.drop();
        done();
    })

    it('Seharusnya sistem mengembalikan maps berdasarkan title dengan metode POST', function (done) {
        chai.request(server)
            .post('/api/maps/search')
            .send({
                title: "Museum Asia Afrika"
            }).end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('title');
                res.body[0].should.have.property('lat');
                res.body[0].should.have.property('lng');
                res.body[0].title.should.equal("Museum Asia Afrika");
                res.body[0].lat.should.equal(-6.921027);
                res.body[0].lng.should.equal(107.610027);
                done();
            })
    })

    it('Seharusnya sistem mengembalikan maps dengan metode GET', function (done) {
        chai.request(server)
            .get('/api/maps')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('title');
                res.body[0].should.have.property('lat');
                res.body[0].should.have.property('lng');
                res.body[0].title.should.equal("Museum Asia Afrika");
                res.body[0].lat.should.equal(-6.921027);
                res.body[0].lng.should.equal(107.610027);
                done();
            })
    })

    it('Seharusnya sistem mengubah data maps dengan metode PUT', function (done) {
        chai.request(server)
            .get('/api/maps')
            .end(function (err, res) {
                chai.request(server)
                    .put('/api/maps/' + res.body[0]._id)
                    .send({
                        title: "Cihampelas Walk",
                        lat: -90.4525234,
                        lng: 70.1231231
                    }).end(function (error, response) {
                        response.should.have.status(200);
                        response.should.be.a('object');
                        response.body.should.have.property('success');
                        response.body.should.have.property('message');
                        response.body.should.have.property('data');
                        response.body.success.should.equal(true);
                        response.body.message.should.equal("data has been updated");
                        response.body.data.title.should.equal("Cihampelas Walk");
                        response.body.data.lat.should.equal(-90.4525234);
                        response.body.data.lng.should.equal(70.1231231);
                        done();
                    })
            })
    })

    it('Seharusnya menambahkan data dengan metode POST', function (done) {
        chai.request(server)
            .post('/api/maps')
            .send({
                title: "Cihampelas Walk",
                lat: -90.4525234,
                lng: 70.1231231
            }).end(function (error, response) {
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('success');
                response.body.should.have.property('message');
                response.body.should.have.property('data');
                response.body.success.should.equal(true);
                response.body.message.should.equal("data has been added");
                response.body.data.title.should.equal("Cihampelas Walk");
                response.body.data.lat.should.equal(-90.4525234);
                response.body.data.lng.should.equal(70.1231231);
                done();
            })
    })

    it('Seharusnya menghapus data berdasarkan id dengan metode DELETE', function (done) {
        chai.request(server)
            .get('/api/maps')
            .end(function (er, res) {
                chai.request(server)
                    .delete('/api/maps/' + res.body[0]._id)
                    .end(function (error, response) {
                        response.should.have.status(200);
                        response.should.be.json;
                        response.body.should.be.a('object');
                        response.body.should.have.property('success');
                        response.body.should.have.property('message');
                        response.body.should.have.property('data');
                        response.body.success.should.equal(true);
                        response.body.message.should.equal("data has been deleted");
                        response.body.data.title.should.equal("Museum Asia Afrika");
                        response.body.data.lat.should.equal(-6.921027);
                        response.body.data.lng.should.equal(107.610027);
                        done();
                    })
            })
    })

    it('seharusnya menampilkan data berdasarkan id dengan metode GET', function(done){
        chai.request(server)
        .get('/api/maps')
        .end(function(err,res){
            chai.request(server)
            .get('/api/maps/' + res.body[0]._id)
            .end(function(error, response){
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('success');
                response.body.should.have.property('message');
                response.body.should.have.property('data');
                response.body.success.should.equal(true);
                response.body.message.should.equal("data found");
                response.body.data.title.should.equal("Museum Asia Afrika");
                response.body.data.lat.should.equal(-6.921027);
                response.body.data.lng.should.equal(107.610027);
                done();
            })
        })
    })
})