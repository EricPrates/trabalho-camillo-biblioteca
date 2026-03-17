import { useState, useEffect } from 'react';
import { listarLivros, cadastrarLivro, atualizarLivro, deletarLivro } from '@/Services/livroService';
import { ILivro } from '@/types';
import validator from '@/validator/validator';

export const useLivros = () => {
    const [livros, setLivros] = useState<ILivro[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        titulo: '', autor: '', editora: '', anoPublicacao: '',
        categoria: '', quantidadeTotal: '', localizacao: ''
    });

    useEffect(() => {
        carregarLivros();
    }, []);

    const carregarLivros = async () => {
        try {
            const data = await listarLivros();
            setLivros(data);
        } catch (error) {
            alert('Erro ao carregar livros');
        }
    };

    const resetarForm = () => {
        setShowForm(false);
        setEditandoId(null);
        setFormData({
            titulo: '', autor: '', editora: '', anoPublicacao: '',
            categoria: '', quantidadeTotal: '', localizacao: ''
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validacao = validator.validarCadastroLivro(formData);
        if (!validacao.valido) {
            alert(validacao.mensagem);
            return;
        }

        setLoading(true);
        try {
            const dados = {
                titulo: formData.titulo,
                autor: formData.autor,
                quantidadeTotal: parseInt(formData.quantidadeTotal),
                ...(formData.editora && { editora: formData.editora }),
                ...(formData.anoPublicacao && { anoPublicacao: parseInt(formData.anoPublicacao) }),
                ...(formData.categoria && { categoria: formData.categoria }),
                ...(formData.localizacao && { localizacao: formData.localizacao })
            };

            if (editandoId) {
                await atualizarLivro(editandoId, dados);
                alert('Livro atualizado!');
            } else {
                await cadastrarLivro(dados);
                alert('Livro cadastrado!');
            }
            resetarForm();
            carregarLivros();
        } catch (error) {
            const mensagem = error instanceof Error ? error.message : 'Erro ao salvar livro';
            alert(mensagem);
        } finally {
            setLoading(false);
        }
    };

    const handleEditar = (livro: ILivro) => {
        if (!livro.id) return;

        setEditandoId(livro.id);
        setFormData({
            titulo: livro.titulo,
            autor: livro.autor,
            editora: livro.editora || '',
            anoPublicacao: livro.anoPublicacao?.toString() || '',
            categoria: livro.categoria || '',
            quantidadeTotal: livro.quantidadeTotal.toString(),
            localizacao: livro.localizacao || ''
        });
        setShowForm(true);
    };

    const handleExcluir = async (id?: number) => {
        if (!id || !confirm('Tem certeza que deseja excluir este livro?')) return;

        setLoading(true);
        try {
            await deletarLivro(id);
            alert('Livro excluído!');
            carregarLivros();
        } catch (error) {
            const mensagem = error instanceof Error ? error.message : 'Erro ao excluir livro';
            alert(mensagem);
        } finally {
            setLoading(false);
        }
    };

    return {
        state: { livros, showForm, formData, editandoId, loading },
        actions: { setShowForm, setFormData, handleSubmit, handleEditar, handleExcluir, handleCancelar: resetarForm }
    };
};
