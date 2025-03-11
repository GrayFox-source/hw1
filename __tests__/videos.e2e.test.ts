import request from 'supertest'
import {app} from "../src";



describe('Videos API TESTS', () => {

    beforeAll(async () => {
        await request(app).delete('/vid/data')
    })

    it('should return 200', async function () {
        await request(app).get('/hometask_01/api/videos')
            .expect(200, [])
    });


})