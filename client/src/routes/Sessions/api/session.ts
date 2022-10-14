import {ExerciseState, Session} from '../../../../../shared/src/types/Session';
import apiClient from '../../../lib/apiClient/apiClient';

const SESSIONS_ENDPOINT = '/sessions';

export const addSession = async (
  contentId: Session['contentId'],
  startTime: Session['startTime'],
): Promise<Session> => {
  try {
    const response = await apiClient(SESSIONS_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({contentId, startTime}),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  } catch (cause) {
    throw new Error('Could not create a session', {cause});
  }
};

export const updateSession = async (
  id: string,
  data: Partial<Pick<Session, 'started' | 'ended'>>,
) => {
  try {
    const response = await apiClient(`${SESSIONS_ENDPOINT}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  } catch (cause) {
    throw new Error('Could not update session', {cause});
  }
};

export const updateSessionExerciseState = async (
  id: string,
  data: Partial<ExerciseState>,
) => {
  try {
    const response = await apiClient(
      `${SESSIONS_ENDPOINT}/${id}/exerciseState`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  } catch (cause) {
    throw new Error('Could not update session exercise state', {cause});
  }
};

export const deleteSession = async (id: string) => {
  try {
    const response = await apiClient(`${SESSIONS_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.text();
  } catch (cause) {
    throw new Error('Could not delete session', {cause});
  }
};