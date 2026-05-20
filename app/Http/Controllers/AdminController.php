<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\OrangTua;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    // ==========================================
    // KELAS CRUD
    // ==========================================
    public function storeKelas(Request $request)
    {
        $request->validate([
            'nama_kelas' => 'required|string|unique:kelas,nama_kelas|max:50',
            'wali_kelas_id' => 'nullable|exists:gurus,id',
        ]);

        Kelas::create([
            'nama_kelas' => $request->nama_kelas,
            'wali_kelas_id' => $request->wali_kelas_id,
        ]);

        return back()->with('success', 'Kelas berhasil dibuat.');
    }

    public function updateKelas(Request $request, $id)
    {
        $kelas = Kelas::findOrFail($id);
        
        $request->validate([
            'nama_kelas' => 'required|string|max:50|unique:kelas,nama_kelas,' . $id,
            'wali_kelas_id' => 'nullable|exists:gurus,id',
        ]);

        $kelas->update([
            'nama_kelas' => $request->nama_kelas,
            'wali_kelas_id' => $request->wali_kelas_id,
        ]);

        return back()->with('success', 'Kelas berhasil diperbarui.');
    }

    public function destroyKelas($id)
    {
        $kelas = Kelas::findOrFail($id);
        $kelas->delete();
        return back()->with('success', 'Kelas berhasil dihapus.');
    }

    // ==========================================
    // GURU CRUD
    // ==========================================
    public function storeGuru(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'nip' => 'required|string|unique:gurus,nip|max:50',
            'no_hp' => 'nullable|string|max:20',
        ]);

        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'guru',
            ]);

            Guru::create([
                'user_id' => $user->id,
                'nip' => $request->nip,
                'no_hp' => $request->no_hp,
            ]);
        });

        return back()->with('success', 'Data Guru berhasil ditambahkan.');
    }

    public function updateGuru(Request $request, $id)
    {
        $guru = Guru::findOrFail($id);
        $user = $guru->user;

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'nip' => 'required|string|max:50|unique:gurus,nip,' . $id,
            'no_hp' => 'nullable|string|max:20',
        ]);

        DB::transaction(function () use ($request, $guru, $user) {
            $userUpdate = [
                'name' => $request->name,
                'email' => $request->email,
            ];

            if ($request->filled('password')) {
                $userUpdate['password'] = Hash::make($request->password);
            }

            $user->update($userUpdate);

            $guru->update([
                'nip' => $request->nip,
                'no_hp' => $request->no_hp,
            ]);
        });

        return back()->with('success', 'Data Guru berhasil diperbarui.');
    }

    public function destroyGuru($id)
    {
        $guru = Guru::findOrFail($id);
        // Deleting the user will cascade delete the guru
        $guru->user->delete();
        return back()->with('success', 'Data Guru berhasil dihapus.');
    }

    // ==========================================
    // SISWA CRUD
    // ==========================================
    public function storeSiswa(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'nisn' => 'required|string|unique:siswas,nisn|max:50',
            'kelas_id' => 'required|exists:kelas,id',
            'orangtua_id' => 'nullable|exists:orang_tuas,id',
        ]);

        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'siswa',
            ]);

            Siswa::create([
                'user_id' => $user->id,
                'nisn' => $request->nisn,
                'kelas_id' => $request->kelas_id,
                'orangtua_id' => $request->orangtua_id,
            ]);
        });

        return back()->with('success', 'Data Siswa berhasil ditambahkan.');
    }

    public function updateSiswa(Request $request, $id)
    {
        $siswa = Siswa::findOrFail($id);
        $user = $siswa->user;

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'nisn' => 'required|string|max:50|unique:siswas,nisn,' . $id,
            'kelas_id' => 'required|exists:kelas,id',
            'orangtua_id' => 'nullable|exists:orang_tuas,id',
        ]);

        DB::transaction(function () use ($request, $siswa, $user) {
            $userUpdate = [
                'name' => $request->name,
                'email' => $request->email,
            ];

            if ($request->filled('password')) {
                $userUpdate['password'] = Hash::make($request->password);
            }

            $user->update($userUpdate);

            $siswa->update([
                'nisn' => $request->nisn,
                'kelas_id' => $request->kelas_id,
                'orangtua_id' => $request->orangtua_id,
            ]);
        });

        return back()->with('success', 'Data Siswa berhasil diperbarui.');
    }

    public function destroySiswa($id)
    {
        $siswa = Siswa::findOrFail($id);
        $siswa->user->delete();
        return back()->with('success', 'Data Siswa berhasil dihapus.');
    }

    // ==========================================
    // ORANG TUA CRUD
    // ==========================================
    public function storeOrangTua(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'no_hp' => 'nullable|string|max:20',
        ]);

        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'orangtua',
            ]);

            OrangTua::create([
                'user_id' => $user->id,
                'no_hp' => $request->no_hp,
            ]);
        });

        return back()->with('success', 'Data Orang Tua berhasil ditambahkan.');
    }

    public function updateOrangTua(Request $request, $id)
    {
        $ortu = OrangTua::findOrFail($id);
        $user = $ortu->user;

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'no_hp' => 'nullable|string|max:20',
        ]);

        DB::transaction(function () use ($request, $ortu, $user) {
            $userUpdate = [
                'name' => $request->name,
                'email' => $request->email,
            ];

            if ($request->filled('password')) {
                $userUpdate['password'] = Hash::make($request->password);
            }

            $user->update($userUpdate);

            $ortu->update([
                'no_hp' => $request->no_hp,
            ]);
        });

        return back()->with('success', 'Data Orang Tua berhasil diperbarui.');
    }

    public function destroyOrangTua($id)
    {
        $ortu = OrangTua::findOrFail($id);
        $ortu->user->delete();
        return back()->with('success', 'Data Orang Tua berhasil dihapus.');
    }
}
