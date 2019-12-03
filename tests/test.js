const { createNewEntry, deleteEntry }= require('../postgresDB/index.js');
const { retrieveShoesData } = require('../postgresDB/index.js');
const { pgQuery } = require('../postgresDB/index.js');
const { pool } = require('../postgresDB/index.js');
const axios = require('axios');
const request = require('supertest')
const app = require('../server/index.js');

beforeAll(async ()=>{
	await createNewEntry('shoses3wqsad4r2', {
		"1": 30,
		"2": 20
	}, 3)
})

afterAll(async ()=>{
	await deleteEntry('shoses3wqsad4r2')
})

describe('Handling server API', ()=> {
	it('Should send correct data of existing shoes entries', async ()=>{
		const res = await request(app)
		.get('/trueToSizeCalculation/')
		.query({shoesname: 'shoses3wqsad4r2'})
		expect(res.statusCode).toEqual(200)
		expect(res.body[0].true_to_size_calculation).toBe(3)
	})

	it('Should notify of non-existing shoes entries', async ()=>{
		const res = await request(app)
		.get('/trueToSizeCalculation/')
		.query({shoesname: 'shoses3wqsadrwqweqr2'})
		expect(res.statusCode).toEqual(401)
		expect(res.text).toEqual("shoes entry doesn't exist")
	})

	it('Should create new shoes entries', async ()=>{
		afterEach(async ()=>{
			await deleteEntry('shoses3wqr2')
		})

		const res = await request(app)
		.post('/createNewEntry')
		.send({
			username:'admin',
			password: 'admin',
			shoesName: 'shoses3wqr2',
     	shoesSize: {'1':20, '2':30},
     	trueToSizeCalculation: 3
		})
		await expect(res.statusCode).toEqual(200)
		await expect(res.body.length).toBe(1)

		const res2 = await request(app)
		.get('/trueToSizeCalculation/')
		.query({shoesname: 'shoses3wqr2'})
		expect(res.statusCode).toEqual(200)
		expect(res.body[0].true_to_size_calculation).toEqual(3)
	})

	it('should not allow unauthorized user to create new entry', async ()=>{
		const res = await request(app)
		.post('/createNewEntry')
		.send({
			username:'admin1',
			password: 'admin1',
			shoesName: 'shoses3wqsad4r2',
     	shoesSize: {
				'1':20,
				'2':30,
			},
     	trueToSizeCalculation: 3
		})
		expect(res.statusCode).toEqual(401)
		expect(res.text).toEqual("User doesn't exist")
	})

	it('Should not allow creating duplicated shoes entries', async ()=>{
		const res = await request(app)
		.post('/createNewEntry')
		.send({
			username:'admin',
			password: 'admin',
			shoesName: 'shoses3wqsad4r2',
     	shoesSize: {
				'1':20,
				'2':30,
			},
     	trueToSizeCalculation: 3
		})
		expect(res.statusCode).toEqual(401)
		expect(res.text).toEqual("ERROR: This shoes entry already exists")
	})
})
