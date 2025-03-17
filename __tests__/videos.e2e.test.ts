import request from 'supertest'
import {app} from "../src";



describe('Videos API TESTS', () => {

    beforeAll(async () => {
        await request(app).delete('/hometask_01/api/testing/all-data')
    })

    it('should return 200', async function () {
        await request(app).get('/hometask_01/api/videos')
            .expect(200, [])
        
    });
    it('should return 200', function () {
        
    });


})