import request from 'supertest';
import Koa from 'koa';

import {sessionsRouter} from '.';
import createMockServer from '../lib/createMockServer';
import {createRouter} from '../../lib/routers';
import * as sessionsController from '../../controllers/sessions';
import * as sessionModel from '../../models/session';

jest.mock('../../controllers/sessions');
const mockCreateSession = sessionsController.createSession as jest.Mock;
const mockRemoveSession = sessionsController.removeSession as jest.Mock;
const mockUpdateSession = sessionsController.updateSession as jest.Mock;
const mockUpdateExerciseState =
  sessionsController.updateExerciseState as jest.Mock;

jest.mock('../../models/session');
const mockGetSessions = sessionModel.getSessions as jest.Mock;

const router = createRouter();
router.use('/sessions', sessionsRouter.routes());
const mockServer = createMockServer(
  async (ctx: Koa.Context, next: Koa.Next) => {
    ctx.user = {
      id: 'some-user-id',
    };
    await next();
  },
  router.routes(),
  router.allowedMethods(),
);

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  mockServer.close();
});

describe('/api/sessions', () => {
  describe('GET', () => {
    it('should get sessions', async () => {
      mockGetSessions.mockResolvedValue([
        {
          id: 'some-session-id',
          name: 'some-name',
          url: 'some-url',
          exerciseState: {
            index: 0,
            playing: false,
            timestamp: new Date('2022-10-10T10:00:00Z').toISOString(),
          },
          facilitator: 'some-user-id',
          startTime: new Date('2022-10-10T10:00:00Z').toISOString(),
          started: false,
          ended: false,
        },
        {
          id: 'some-other-session-id',
          name: 'some-other-name',
          url: 'some-other-url',
          exerciseState: {
            index: 0,
            playing: false,
            timestamp: new Date('2022-10-10T10:00:00Z').toISOString(),
          },
          facilitator: 'some-other-user-id',
          startTime: new Date('2022-10-10T10:00:00Z').toISOString(),
          started: false,
          ended: false,
        },
      ]);

      const response = await request(mockServer).get('/sessions');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: 'some-session-id',
          name: 'some-name',
          url: 'some-url',
          exerciseState: {
            index: 0,
            playing: false,
            timestamp: expect.any(String),
          },
          facilitator: 'some-user-id',
          startTime: expect.any(String),
          started: false,
          ended: false,
        },
        {
          id: 'some-other-session-id',
          name: 'some-other-name',
          url: 'some-other-url',
          exerciseState: {
            index: 0,
            playing: false,
            timestamp: expect.any(String),
          },
          facilitator: 'some-other-user-id',
          startTime: expect.any(String),
          started: false,
          ended: false,
        },
      ]);
    });
  });

  describe('POST', () => {
    const startTime = new Date('1994-03-08T07:24:00').toISOString();

    it('should return newly created session', async () => {
      mockCreateSession.mockResolvedValueOnce({id: 'new-session'});
      const response = await request(mockServer)
        .post('/sessions')
        .send({
          contentId: 'some-content-id',
          type: 'public',
          startTime,
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 'new-session',
      });
    });

    it('should fail without session data', async () => {
      const response = await request(mockServer)
        .post('/sessions')
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
    });

    it('should fail if controller throws', async () => {
      mockCreateSession.mockRejectedValueOnce(
        new Error('some error text') as never,
      );
      const response = await request(mockServer)
        .post('/sessions')
        .send({name: 'the name'});
      expect(response.status).toBe(500);
    });
  });

  describe('PUT', () => {
    it('should return updated session', async () => {
      mockUpdateSession.mockResolvedValueOnce({id: 'some-session-id'});
      const response = await request(mockServer)
        .put('/sessions/some-session-id')
        .send({started: true})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 'some-session-id',
      });
    });

    it('should fail on invalid fields', async () => {
      const response = await request(mockServer)
        .put('/sessions/some-session-id')
        .send({invalidField: 'some-value'})
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
    });

    it('should fail when update rejects', async () => {
      mockUpdateSession.mockRejectedValueOnce(new Error('some-error'));
      const response = await request(mockServer)
        .put('/sessions/some-other-session-id')
        .send({started: true})
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
    });
  });

  describe('PUT /:id/exerciseState', () => {
    it('should call session update', async () => {
      mockUpdateExerciseState.mockResolvedValueOnce({id: 'some-session-id'});
      const response = await request(mockServer)
        .put('/sessions/some-session-id/exerciseState')
        .send({index: 2})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 'some-session-id',
      });
    });

    it('should fail when update rejects', async () => {
      mockUpdateExerciseState.mockRejectedValueOnce(new Error('some-error'));
      const response = await request(mockServer)
        .put('/sessions/some-other-session-id/exerciseState')
        .send({playing: true})
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
    });

    it('should require a field', async () => {
      const response = await request(mockServer)
        .put('/sessions/some-session-id/exerciseState')
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Internal Server Error');
      expect(mockUpdateExerciseState).toHaveBeenCalledTimes(0);
    });

    it('does not accept other fields', async () => {
      mockUpdateExerciseState.mockResolvedValueOnce({id: 'some-session-id'});
      const response = await request(mockServer)
        .put('/sessions/some-session-id/exerciseState')
        .send({index: 1, foo: 'bar'})
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(mockUpdateExerciseState).toHaveBeenCalledTimes(1);
      expect(mockUpdateExerciseState).toHaveBeenCalledWith(
        'some-user-id',
        'some-session-id',
        {
          index: 1,
        },
      );
    });
  });

  describe('DELETE', () => {
    it('should delete and confirm on response', async () => {
      mockRemoveSession.mockResolvedValue(undefined);
      const response = await request(mockServer)
        .delete('/sessions/some-session-id')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.text).toEqual('Session deleted successfully');
    });
  });
});
