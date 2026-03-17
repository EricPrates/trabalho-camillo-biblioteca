import { useState, useEffect } from 'react';
import { listarUsuarios, criarUsuario, atualizarUsuario, deletarUsuario } from '@/Services/usuarioService';
import { IUsuario } from '@/types';
import validator from '@/validator/validator';

export const useUsuarios = () => {
    const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ nome: '', email: '', senha: '', tipo: 'aluno' as 'admin' | 'bibliotecario' | 'aluno', matricula: '' });

    useEffect(() => {
        carregarUsuarios();
    }, []);

    const carregarUsuarios = async () => {
        try {
            const data = await listarUsuarios();
            setUsuarios(data);
        } catch (error) {
            alert('Erro ao carregar usuários');
        }
    };

    const resetarForm = () => {
        setShowForm(false);
        setEditandoId(null);
        setFormData({ nome: '', email: '', senha: '', tipo: 'aluno', matricula: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validacao = editandoId
            ? validator.validarEdicaoUsuario(formData)
            : validator.validarCadastroUsuario(formData);

        if (!validacao.valido) {
            alert(validacao.mensagem);
            return;
        }

        setLoading(true);
        try {
            if (editandoId) {
                const dados: Partial<IUsuario> = {
                    nome: formData.nome,
                    email: formData.email,
                    tipo: formData.tipo,
                    ...(formData.senha.trim() && { senha: formData.senha }),
                    ...(formData.tipo === 'aluno' && { matricula: formData.matricula })
                };
                await atualizarUsuario(editandoId, dados);
                alert('Usuário atualizado!');
            } else {
                await criarUsuario(formData);
                alert('Usuário criado!');
            }
            resetarForm();
            carregarUsuarios();
        } catch (error) {
            const mensagem = error instanceof Error ? error.message : 'Erro ao salvar usuário';
            alert(mensagem);
        } finally {
            setLoading(false);
        }
    };

    const handleEditar = (usuario: IUsuario) => {
        if (!usuario.id) return;
        setEditandoId(usuario.id);
        setFormData({
            nome: usuario.nome,
            email: usuario.email,
            senha: '',
            tipo: usuario.tipo,
            matricula: usuario.matricula || ''
        });
        setShowForm(true);
    };

    const handleExcluir = async (id?: number) => {
        if (!id || !confirm('Tem certeza que deseja excluir este usuário?')) return;
        setLoading(true);
        try {
            await deletarUsuario(id);
            alert('Usuário excluído!');
            carregarUsuarios();
        } catch (error) {
            const mensagem = error instanceof Error ? error.message : 'Erro ao excluir usuário';
            alert(mensagem);
        } finally {
            setLoading(false);
        }
    };

    return {
        state: { usuarios, showForm, formData, editandoId, loading },
        actions: { setShowForm, setFormData, handleSubmit, handleEditar, handleExcluir, handleCancelar: resetarForm }
    };
};
