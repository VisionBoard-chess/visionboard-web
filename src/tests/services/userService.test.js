import { test, expect, vi, beforeEach } from 'vitest';
import { loginWithFirebase, registerWithFirebase, logoutFromFirebase, createUserInBackend, getUserByFirebaseUid, checkNickname} from "../../services/userService.js";
import * as apiClient from '../../services/apiClient.js';
import {signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

vi.mock('firebase/auth',() => ({
        getAuth: vi.fn(() => ({})),
        signInWithEmailAndPassword: vi.fn(),
        createUserWithEmailAndPassword: vi.fn(),
        signOut: vi.fn(),
    })
);

vi.mock('../firebase/config', () => ({ auth: {}}));

beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(apiClient, 'authenticatedFetch').mockResolvedValue({id:1})
});

test('loginWithFirebase_throws_if_firebase_fails', async () => {
    signInWithEmailAndPassword.mockRejectedValue(new Error('Wrong password'));
    await expect(loginWithFirebase('i@i.com', 'wrong')).rejects.toThrow('Wrong password')
})

test('loginWithFirebase_returns_user_on_success', async () => {
    const fakeUser = { uid: 'fakeUser' }
    signInWithEmailAndPassword.mockResolvedValue({ user: fakeUser });
    const result = await loginWithFirebase('i@i.com', 'i123i1');
    expect(result).toEqual(fakeUser)
})

test('registerWithFirebase_throws_if_firebase_fails', async () => {
    createUserWithEmailAndPassword.mockRejectedValue(new Error('Email already in use'));
    await expect(registerWithFirebase('i@i.com', 'i123i1')).rejects.toThrow('Email already in use')
})

test('registerWithFirebase_returns_user_on_success', async () => {
    const fakeUser = { uid: 'fakeUser' }
    createUserWithEmailAndPassword.mockResolvedValue({ user: fakeUser })
    const result = await registerWithFirebase('i@i.com', 'i123i1')
    expect(result).toEqual(fakeUser)
})

test('logoutFromFirebase_calls_signOut', async () => {
    signOut.mockResolvedValue()
    await logoutFromFirebase()
    expect(signOut).toHaveBeenCalledTimes(1)
})

test('createUserInBackend', async () => {
    await createUserInBackend({firebaseUid: 'uid', nickname: 'nickname'})
    expect(apiClient.authenticatedFetch).toHaveBeenCalledWith('/user/register',{
        method: 'POST',
        body: JSON.stringify({firebaseUid: 'uid', nickname: 'nickname'})
    })
})

test('getUserByFirebaseUid_calls_correctly', async () => {
    await getUserByFirebaseUid('uid')
    expect(apiClient.authenticatedFetch).toHaveBeenCalledWith('/user/uid')
})

test('checkNickname_calls_correctly', async () => {
    await checkNickname('nickname')
    expect(apiClient.authenticatedFetch).toHaveBeenCalledWith('/user/check-nickname?nickname=nickname')
})