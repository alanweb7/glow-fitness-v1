import React, { useState, useEffect } from 'react';
import { Shield, Plus, Edit, Trash2, Loader2, X, Check, ChevronDown, ChevronRight, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Role, Permission } from '../types';

interface RoleWithPermissions extends Role {
  permissions: string[];
}

export const AdminRoles: React.FC = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<RoleWithPermissions[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Partial<RoleWithPermissions> | null>(null);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [rolesRes, permsRes, rpRes] = await Promise.all([
      supabase.from('roles').select('*').order('name'),
      supabase.from('permissions').select('*').order('module'),
      supabase.from('role_permissions').select('*'),
    ]);

    if (rolesRes.error) console.error('Error loading roles:', rolesRes.error);
    if (permsRes.error) console.error('Error loading permissions:', permsRes.error);
    if (rpRes.error) console.error('Error loading role_permissions:', rpRes.error);

    if (rolesRes.data && rpRes.data) {
      const mapped: RoleWithPermissions[] = rolesRes.data.map((r: any) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        isSystem: r.is_system,
        createdAt: r.created_at,
        permissions: rpRes.data
          .filter((rp: any) => rp.role_id === r.id)
          .map((rp: any) => rp.permission_id),
      }));
      setRoles(mapped);
    }

    if (permsRes.data) {
      const mapped: Permission[] = permsRes.data.map((p: any) => ({
        id: p.id,
        module: p.module,
        action: p.action,
        description: p.description,
      }));
      setAllPermissions(mapped);
    }

    setLoading(false);
  };

  const modules = [...new Set(allPermissions.map(p => p.module))];

  const getModulePermissions = (module: string) =>
    allPermissions.filter(p => p.module === module);

  const toggleModule = (module: string) => {
    setExpandedModules(prev => ({ ...prev, [module]: !prev[module] }));
  };

  const togglePerm = (permId: string) => {
    setSelectedPerms(prev =>
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  const toggleModuleAll = (module: string) => {
    const modulePerms = getModulePermissions(module).map(p => p.id);
    const allSelected = modulePerms.every(p => selectedPerms.includes(p));
    if (allSelected) {
      setSelectedPerms(prev => prev.filter(p => !modulePerms.includes(p)));
    } else {
      setSelectedPerms(prev => [...new Set([...prev, ...modulePerms])]);
    }
  };

  const handleSave = async () => {
    if (!editingRole?.name) return;
    setSaving(true);

    try {
      let roleId = editingRole.id;

      if (roleId) {
        // Update existing role
        await supabase
          .from('roles')
          .update({ name: editingRole.name, description: editingRole.description })
          .eq('id', roleId);
      } else {
        // Create new role
        roleId = editingRole.name.toLowerCase().replace(/\s+/g, '_');
        await supabase.from('roles').insert({
          id: roleId,
          name: editingRole.name,
          description: editingRole.description,
          is_system: false,
        });
      }

      // Update permissions: delete old, insert new
      await supabase.from('role_permissions').delete().eq('role_id', roleId);
      if (selectedPerms.length > 0) {
        await supabase.from('role_permissions').insert(
          selectedPerms.map(pId => ({ role_id: roleId, permission_id: pId }))
        );
      }

      setIsModalOpen(false);
      setEditingRole(null);
      setSelectedPerms([]);
      await loadData();
    } catch (err) {
      console.error('Error saving role:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (roleId: string) => {
    if (!confirm('Tem certeza que deseja excluir este perfil?')) return;
    await supabase.from('role_permissions').delete().eq('role_id', roleId);
    await supabase.from('roles').delete().eq('id', roleId);
    await loadData();
  };

  const getPermCount = (roleId: string) =>
    roles.find(r => r.id === roleId)?.permissions.length || 0;

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
        <p className="text-sm text-neutral-500">{roles.length} perfis de acesso</p>
        <button
          onClick={() => {
            setEditingRole({ name: '', description: '', permissions: [] });
            setSelectedPerms([]);
            setIsModalOpen(true);
          }}
          className="bg-[#C18282] hover:bg-[#a86a6a] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Novo Perfil
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map(role => (
          <div key={role.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  role.id === 'admin' ? 'bg-purple-100 text-purple-600' :
                  role.id === 'manager' ? 'bg-blue-100 text-blue-600' :
                  role.id === 'editor' ? 'bg-amber-100 text-amber-600' :
                  'bg-neutral-100 text-neutral-600'
                }`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{role.name}</h3>
                  {role.isSystem && (
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Sistema</span>
                  )}
                </div>
              </div>
              {!role.isSystem && (
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditingRole(role);
                      setSelectedPerms(role.permissions);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-neutral-500 hover:text-[#C18282] hover:bg-[#C18282]/10 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(role.id)}
                    className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-neutral-500 mb-3">{role.description || 'Sem descrição'}</p>

            <div className="flex items-center gap-2 text-xs text-neutral-600 border-t border-neutral-100 pt-3">
              <Lock className="w-3.5 h-3.5 text-neutral-400" />
              <span>{getPermCount(role.id)} permissões</span>
            </div>
          </div>
        ))}
      </div>

      {/* Permissions Reference */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
        <h3 className="font-semibold text-neutral-800 mb-4">Referência de Permissões</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map(mod => (
            <div key={mod} className="border border-neutral-200 rounded-lg p-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">{mod}</h4>
              <div className="space-y-1">
                {getModulePermissions(mod).map(p => (
                  <div key={p.id} className="flex items-center gap-2 text-xs text-neutral-600">
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span>{p.description || p.id}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && editingRole && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">
                {editingRole.id ? 'Editar Perfil' : 'Novo Perfil'}
              </h3>
              <button
                onClick={() => { setIsModalOpen(false); setEditingRole(null); setSelectedPerms([]); }}
                className="p-1 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Nome do Perfil *</label>
                <input
                  type="text"
                  value={editingRole.name || ''}
                  onChange={e => setEditingRole({ ...editingRole, name: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                  placeholder="Ex: Gerente de Loja"
                  disabled={editingRole.isSystem}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Descrição</label>
                <input
                  type="text"
                  value={editingRole.description || ''}
                  onChange={e => setEditingRole({ ...editingRole, description: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                  placeholder="Descreva as responsabilidades deste perfil"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-2">Permissões</label>
                <div className="space-y-2">
                  {modules.map(mod => {
                    const modulePerms = getModulePermissions(mod);
                    const selectedCount = modulePerms.filter(p => selectedPerms.includes(p.id)).length;
                    const allSelected = selectedCount === modulePerms.length;

                    return (
                      <div key={mod} className="border border-neutral-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleModule(mod)}
                          className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50 hover:bg-neutral-100 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={allSelected}
                              onChange={() => toggleModuleAll(mod)}
                              onClick={e => e.stopPropagation()}
                              className="w-4 h-4 rounded border-neutral-300 text-[#C18282] focus:ring-[#C18282]"
                            />
                            <span className="text-sm font-semibold text-neutral-800 uppercase tracking-wider">{mod}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-neutral-500">{selectedCount}/{modulePerms.length}</span>
                            <ChevronRight className={`w-4 h-4 text-neutral-400 transition-transform ${expandedModules[mod] ? 'rotate-90' : ''}`} />
                          </div>
                        </button>
                        {expandedModules[mod] && (
                          <div className="px-4 py-3 space-y-2 border-t border-neutral-100">
                            {modulePerms.map(p => (
                              <label key={p.id} className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedPerms.includes(p.id)}
                                  onChange={() => togglePerm(p.id)}
                                  className="w-4 h-4 rounded border-neutral-300 text-[#C18282] focus:ring-[#C18282]"
                                />
                                <div>
                                  <span className="text-sm text-neutral-700">{p.description || p.id}</span>
                                  <span className="text-[10px] text-neutral-400 ml-2">({p.id})</span>
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-neutral-200 flex gap-3">
              <button
                onClick={() => { setIsModalOpen(false); setEditingRole(null); setSelectedPerms([]); }}
                className="flex-1 border border-neutral-300 py-2.5 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !editingRole.name}
                className="flex-1 bg-[#C18282] hover:bg-[#a86a6a] text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {editingRole.id ? 'Salvar Alterações' : 'Criar Perfil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
