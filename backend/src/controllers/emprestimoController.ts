import { Request, Response } from 'express';
import db from '../models/index';
import { IEmprestimo, ILivro } from '../models/types/types';

const Emprestimo = db.Emprestimo;
const Livro = db.Livro;
const Usuario = db.Usuario;

// Criar empréstimo somente admin e bibliotecario pode
export const criar = async (req: Request, res: Response) => {
    try {
        const { usuarioId, livroId, dataPrevistaDevolucao } = req.body;

        if (!usuarioId || !livroId || !dataPrevistaDevolucao) {
            return res.status(400).send({ message: 'UsuarioId, livroId e dataPrevistaDevolucao são obrigatórios' });
        }

        // Validar se a data de devolução é futura
        const dataEmprestimo = new Date();
        const dataDevolucao = new Date(dataPrevistaDevolucao + 'T12:00:00');
<<<<<<< HEAD

=======
        
>>>>>>> 23b0f80bccc0134d738d710987867636e668b445
        if (dataDevolucao <= dataEmprestimo) {
            return res.status(400).send({ message: 'A data de devolução prevista deve ser posterior à data atual' });
        }

        const usuario = await Usuario.findByPk(usuarioId);
        if (!usuario) {
            return res.status(404).send({ message: 'Usuário não encontrado' });
        }

        const livro = await Livro.findByPk(livroId) as ILivro | null;
        if (!livro) {
            return res.status(404).send({ message: 'Livro não encontrado' });
        }

        if (livro.quantidadeDisponivel <= 0) {
            return res.status(400).send({ message: 'Livro indisponível para empréstimo' });
        }

        const emprestimo = await Emprestimo.create({
            usuarioId, livroId, dataEmprestimo,
            dataPrevistaDevolucao: dataDevolucao, status: 'ativo', diasAtraso: 0
        }) as unknown as IEmprestimo;

        // Atualizar quantidade disponível do livro
        livro.quantidadeDisponivel -= 1;
        await livro.save?.();
        res.status(201).send(emprestimo);
    } catch (error) {
        res.status(500).send({ message: 'Erro ao criar empréstimo!' });
    }
};

// Listar todos empréstimos
export const listar = async (req: Request, res: Response) => {
    try {
        const data = await Emprestimo.findAll({
            include: [
                { model: Usuario, attributes: ['id', 'nome', 'email', 'tipo', 'matricula'] },
                { model: Livro, attributes: ['id', 'titulo', 'autor'] }
            ],
            order: [['dataEmprestimo', 'DESC']]
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: 'Erro ao buscar empréstimos' });
    }
};

// Buscar UM empréstimo específico
export const buscarPorId = async (req: Request, res: Response) => {
    try {
        const data = await Emprestimo.findByPk(req.params.id, {
            include: [
                { model: Usuario, attributes: ['id', 'nome', 'email', 'tipo', 'matricula'] },
                { model: Livro, attributes: ['id', 'titulo', 'autor'] }
            ]
        }) as IEmprestimo | null;

        if (!data) {
            return res.status(404).send({ message: `Empréstimo com id ${req.params.id} não encontrado` });
        }

        res.send(data);
    } catch (error) {
        res.status(500).send({ message: 'Erro ao buscar empréstimo!' });
    }
};

// Listar TODOS empréstimos de um usuário
export const listarPorUsuario = async (req: Request, res: Response) => {
    try {
        const data = await Emprestimo.findAll({
            where: { usuarioId: req.params.usuarioId },
            include: [
                { model: Livro, attributes: ['id', 'titulo', 'autor'] }
            ],
            order: [['dataEmprestimo', 'DESC']]
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: 'Erro ao buscar empréstimos do usuário!' });
    }
};

// Listar empréstimos do próprio aluno
export const meusEmprestimos = async (req: Request, res: Response) => {
    try {
        const userFromToken = JSON.parse(req.headers['user'] as string);

        const data = await Emprestimo.findAll({
            where: { usuarioId: userFromToken.id },
            include: [
                { model: Livro, attributes: ['id', 'titulo', 'autor'] }
            ],
            order: [['dataEmprestimo', 'DESC']]
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: 'Erro ao buscar seus empréstimos!' });
    }
};
