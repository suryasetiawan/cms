const chai = require('chai');
const chaiHTTP = require('chai-http');
const server = require('../app');

const Datadate = require('../models/datadate');
const should = chai.should();

chai.use(chaiHTTP);

describe('datadate', function(){

    beforeEach(function(done){
        let datadate = new Datadate({
            letter : "2019-01-11",
            frequency : 5.55
        })
        datadate.save(function(err){
            done();
        })
    })

    afterEach(function(done){
        Datadate.collection.drop();
        done();
    })

    it('Seharusnya sistem mengembalikan datadate berdasarkan nilai letter yang dimasukan dengan metode POST', function(done){
        chai.request(server)
        .post('/api/datadate/search')
        .send({
            letter: "2019-01-11"
        }).end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body[0].should.be.a('object');
            res.body[0].should.have.property('letter');
            res.body[0].should.have.property('frequency');
            res.body[0].letter.should.equal("2019-01-11");
            res.body[0].frequency.should.equal(5.55);
            done();
        })
    })

    it('Seharusnya sistem mengembalikan datadate dengan metode GET', function(done){
        chai.request(server)
        .get('/api/datadate')
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body[0].should.be.a('object');
            res.body[0].should.have.property('letter');
            res.body[0].should.have.property('frequency');
            res.body[0].letter.should.equal("2019-01-11");
            res.body[0].frequency.should.equal(5.55);
            done();
        })
    })

    it('Seharusnya sistem berhasil mengubah datadate dengan metode PUT', function(done) {
        chai.request(server)
        .get('/api/datadate')
        .end(function(err,res){
            chai.request(server)
            .put('/api/datadate/' + res.body[0]._id)
            .send({
                letter: "2019-01-11",
                frequency: 6.66
            }).end(function(error, response){
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('success');
                response.body.should.have.property('message');
                response.body.should.have.property('data');
                response.body.success.should.equal(true);
                response.body.message.should.equal("datadate has been updated");
                response.body.data.letter.should.equal("2019-01-11");
                response.body.data.frequency.should.equal(6.66);
                done();
            })
        })
    })

    it('seharusnya menambahkan satu datadate dengan metode POST', function(done) {
        chai.request(server)
        .post('/api/datadate')
        .send({
            letter: "2012-02-12",
            frequency: 8.88
        }).end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('success');
            res.body.should.have.property('message');
            res.body.should.have.property('data');
            res.body.success.should.equal(true);
            res.body.message.should.equal("datadate has been added");
            res.body.data.letter.should.equal("2012-02-12");
            res.body.data.frequency.should.equal(8.88);
            done();
        })
    })

    it('seharusnya menghapus satu data berdasarkan id dengan metode DELETE', function(done){
        chai.request(server)
        .get('/api/datadate')
        .end(function(err, res){
            chai.request(server)
            .delete('/api/datadate/' + res.body[0]._id)
            .end(function(error, response){
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('success');
                response.body.should.have.property('message');
                response.body.should.have.property('data');
                response.body.success.should.equal(true);
                response.body.message.should.equal("datadate has been deleted");
                response.body.data.letter.should.equal("2019-01-11");
                response.body.data.frequency.should.equal(5.55);
                done();
            })
        })      
    })

    it('seharusnya menampilkan datadate bersasarkan id dengan metode GET', function(done){
        chai.request(server)
        .get('/api/datadate')
        .end(function(err, res){
            chai.request(server)
            .get('/api/datadate/' + res.body[0]._id)
            .end(function(error, response){
                response.should.have.status(200);
                response.should.be.json;
                response.body.should.be.a('object');
                response.body.should.have.property('success');
                response.body.should.have.property('message');
                response.body.should.have.property('data');
                response.body.success.should.equal(true);
                response.body.message.should.equal("datadate found");
                response.body.data.letter.should.equal("2019-01-11");
                response.body.data.frequency.should.equal(5.55);
                done();
            })
        })
    })
})