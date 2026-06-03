export type * from './auth';
export type * from './navigation';
export type * from './ui';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Siswa' | 'Guru' | 'Staf';

export interface PresenceLog {
    id: string;
    name: string;
    role: UserRole;
    meta: string; // e.g. Kelas untuk Siswa, Mata Pelajaran untuk Guru, Departemen untuk Staf
    time: string;
    status: 'Tepat Waktu' | 'Terlambat';
    avatarSeed: string;
}

export interface PresetUser {
    id: string;
    name: string;
    role: UserRole;
    meta: string;
    avatarSeed: string;
    cardId: string;
}
