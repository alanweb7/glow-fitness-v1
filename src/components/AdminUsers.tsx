import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Shield, Search, Mail, Calendar, Loader2, X, Check, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { UserRole, Role } from '../types';

export const AdminUsers: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserRole[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<UserRole> | null>(null);
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [usersRes, rolesRes] = await Promise.all([
      supabase.from('user_profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('roles').select('*').order('name'),
    ]);

    if (usersRes.error) {
      console.error('Error loading users:', usersRes.error);
    }
    if (rolesRes.error) {
      console.error('Error loading roles:', rolesRes.error);
    }

    if (usersRes.data) {
      const mapped: UserRole[] = usersRes.data.map((u: any) => ({
        id: u.id,
        fullName: u.full_name || '',
        role: u.role || 'customer',
        roleId: u.role_id,
        createdAt: u.created_at,
      }));
      setUsers(mapped);
    }

    if (rolesRes.data) {
      const mapped: Role[] = rolesRes.data.map((r: any) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        isSystem: r.is_system,
        createdAt: r.created_at,
      }));
      setRoles(mapped);
    }

    setLoading(false);
  };

  const filtered = users.filter(u =>
    u.fullName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    u.role.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleSave = async () => {
    if (!editingUser?.fullName) return;
    setSaving(true);
    setFormError('');

    try {
      if (editingUser.id) {
        // Update existing user
        await supabase
          .from('user_profiles')
          .update({
            full_name: editingUser.fullName,
            role: editingUser.role,
            role_id: editingUser.roleId,
          })
          .eq('id', editingUser.id);
      } else {
        // Create new user via Edge Function
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-create-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            email: (editingUser as any).email,
            password: newPassword || 'Temp@123456',
            fullName: editingUser.fullName,
            roleId: editingUser.roleId || 'customer',
          }),
        });

        const result = await res.json();
        if (!res.ok) {
          setFormError(result.error || 'Erro ao criar usuário');
          return;
        }
      }

      setIsModalOpen(false);
      setEditingUser(null);
      setNewPassword('');
      await loadData();
    } catch (err) {
      console.error('Error saving user:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    await supabase.from('user_profiles').delete().eq('id', userId);
    await loadData();
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-700',
      manager: 'bg-blue-100 text-blue-700',
      editor: 'bg-amber-100 text-amber-700',
      customer: 'bg-neutral-100 text-neutral-600',
    };
    return colors[role] || 'bg-neutral-100 text-neutral-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#C18282]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-neutral-500">{users.length} usuários cadastrados</p>
          <button
          onClick={() => {
            setEditingUser({ fullName: '', role: 'customer', roleId: 'customer' });
            setFormError('');
            setIsModalOpen(true);
          }}
          className="bg-[#C18282] hover:bg-[#a86a6a] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Novo Usuário
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Buscar por nome ou perfil..."
          value={searchFilter}
          onChange={e => setSearchFilter(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-[#C18282]"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Usuário</th>
              <th className="px-6 py-3 text-left font-semibold">Perfil</th>
              <th className="px-6 py-3 text-left font-semibold">ID</th>
              <th className="px-6 py-3 text-left font-semibold">Criado em</th>
              <th className="px-6 py-3 text-right font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filtered.map(user => (
              <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#C18282]/20 rounded-full flex items-center justify-center">
                      <span className="text-[#C18282] font-bold text-sm">
                        {user.fullName?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{user.fullName}</p>
                      <p className="text-xs text-neutral-500">{user.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${getRoleBadge(user.role)}`}>
                    {roles.find(r => r.id === user.role)?.name || user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-neutral-500 font-mono">{user.id.slice(0, 12)}...</td>
                <td className="px-6 py-4 text-neutral-500 text-xs">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-neutral-500 hover:text-[#C18282] hover:bg-[#C18282]/10 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-neutral-400">
                  Nenhum usuário encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">
                {editingUser.id ? 'Editar Usuário' : 'Novo Usuário'}
              </h3>
              <button
                onClick={() => { setIsModalOpen(false); setEditingUser(null); setNewPassword(''); setFormError(''); }}
                className="p-1 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                  {formError}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  value={editingUser.fullName || ''}
                  onChange={e => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                  required
                />
              </div>

              {!editingUser.id && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">E-mail *</label>
                  <input
                    type="email"
                    value={(editingUser as any).email || ''}
                    onChange={e => setEditingUser({ ...editingUser, email: e.target.value } as any)}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                    required
                  />
                </div>
              )}

              {!editingUser.id && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Senha Inicial</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">Se vazio, será definida como "Temp@123456"</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Perfil de Acesso *</label>
                <select
                  value={editingUser.roleId || editingUser.role || 'customer'}
                  onChange={e => {
                    const roleId = e.target.value;
                    const role = roles.find(r => r.id === roleId);
                    setEditingUser({ ...editingUser, roleId, role: roleId });
                  }}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm bg-white"
                >
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-neutral-200 flex gap-3">
              <button
                onClick={() => { setIsModalOpen(false); setEditingUser(null); setNewPassword(''); setFormError(''); }}
                className="flex-1 border border-neutral-300 py-2.5 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !editingUser.fullName}
                className="flex-1 bg-[#C18282] hover:bg-[#a86a6a] text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {editingUser.id ? 'Salvar' : 'Criar Usuário'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
