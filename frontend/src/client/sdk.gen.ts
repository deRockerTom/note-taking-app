// This file is auto-generated by @hey-api/openapi-ts

import type { Options as ClientOptions, TDataShape, Client } from '@hey-api/client-fetch';
import type { RootGetData, RootGetResponse, HealthApiV1HealthGetData, HealthApiV1HealthGetResponse, GetNotesApiV1NotesGetData, GetNotesApiV1NotesGetResponse, CreateOneNoteApiV1NotesPostData, CreateOneNoteApiV1NotesPostResponse, CreateOneNoteApiV1NotesPostError, DeleteOneNoteApiV1NotesNoteIdDeleteData, DeleteOneNoteApiV1NotesNoteIdDeleteResponse, DeleteOneNoteApiV1NotesNoteIdDeleteError, GetOneNoteApiV1NotesNoteIdGetData, GetOneNoteApiV1NotesNoteIdGetResponse, GetOneNoteApiV1NotesNoteIdGetError, UpdateOneNoteApiV1NotesNoteIdPutData, UpdateOneNoteApiV1NotesNoteIdPutResponse, UpdateOneNoteApiV1NotesNoteIdPutError, RollbackOneNoteApiV1NotesNoteIdRollbackPostData, RollbackOneNoteApiV1NotesNoteIdRollbackPostResponse, RollbackOneNoteApiV1NotesNoteIdRollbackPostError } from './types.gen';
import { client as _heyApiClient } from './client.gen';

export type Options<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean> = ClientOptions<TData, ThrowOnError> & {
    /**
     * You can provide a client instance returned by `createClient()` instead of
     * individual options. This might be also useful if you want to implement a
     * custom client.
     */
    client?: Client;
    /**
     * You can pass arbitrary values through the `meta` object. This can be
     * used to access values that aren't defined as part of the SDK function.
     */
    meta?: Record<string, unknown>;
};

/**
 * Root
 */
export const rootGet = <ThrowOnError extends boolean = false>(options?: Options<RootGetData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<RootGetResponse, unknown, ThrowOnError>({
        url: '/',
        ...options
    });
};

/**
 * Health
 * Health check endpoint.
 */
export const healthApiV1HealthGet = <ThrowOnError extends boolean = false>(options?: Options<HealthApiV1HealthGetData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<HealthApiV1HealthGetResponse, unknown, ThrowOnError>({
        url: '/api/v1/health/',
        ...options
    });
};

/**
 * Get Notes
 * Get all notes.
 */
export const getNotesApiV1NotesGet = <ThrowOnError extends boolean = false>(options?: Options<GetNotesApiV1NotesGetData, ThrowOnError>) => {
    return (options?.client ?? _heyApiClient).get<GetNotesApiV1NotesGetResponse, unknown, ThrowOnError>({
        url: '/api/v1/notes/',
        ...options
    });
};

/**
 * Create One Note
 * Create a new note.
 */
export const createOneNoteApiV1NotesPost = <ThrowOnError extends boolean = false>(options: Options<CreateOneNoteApiV1NotesPostData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).post<CreateOneNoteApiV1NotesPostResponse, CreateOneNoteApiV1NotesPostError, ThrowOnError>({
        url: '/api/v1/notes/',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Delete One Note
 * Delete a note by ID.
 */
export const deleteOneNoteApiV1NotesNoteIdDelete = <ThrowOnError extends boolean = false>(options: Options<DeleteOneNoteApiV1NotesNoteIdDeleteData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).delete<DeleteOneNoteApiV1NotesNoteIdDeleteResponse, DeleteOneNoteApiV1NotesNoteIdDeleteError, ThrowOnError>({
        url: '/api/v1/notes/{note_id}',
        ...options
    });
};

/**
 * Get One Note
 * Get a note by ID.
 */
export const getOneNoteApiV1NotesNoteIdGet = <ThrowOnError extends boolean = false>(options: Options<GetOneNoteApiV1NotesNoteIdGetData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).get<GetOneNoteApiV1NotesNoteIdGetResponse, GetOneNoteApiV1NotesNoteIdGetError, ThrowOnError>({
        url: '/api/v1/notes/{note_id}',
        ...options
    });
};

/**
 * Update One Note
 * Update a note by ID.
 */
export const updateOneNoteApiV1NotesNoteIdPut = <ThrowOnError extends boolean = false>(options: Options<UpdateOneNoteApiV1NotesNoteIdPutData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).put<UpdateOneNoteApiV1NotesNoteIdPutResponse, UpdateOneNoteApiV1NotesNoteIdPutError, ThrowOnError>({
        url: '/api/v1/notes/{note_id}',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};

/**
 * Rollback One Note
 * Rollback a note by ID.
 */
export const rollbackOneNoteApiV1NotesNoteIdRollbackPost = <ThrowOnError extends boolean = false>(options: Options<RollbackOneNoteApiV1NotesNoteIdRollbackPostData, ThrowOnError>) => {
    return (options.client ?? _heyApiClient).post<RollbackOneNoteApiV1NotesNoteIdRollbackPostResponse, RollbackOneNoteApiV1NotesNoteIdRollbackPostError, ThrowOnError>({
        url: '/api/v1/notes/{note_id}/rollback',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });
};