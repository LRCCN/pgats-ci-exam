import assert from 'node:assert';
import { ServicoDePagamento } from '../src/servicoDePagamento.js';

describe('ServicoDePagamento', () => {
  it('1) pagar: deve armazenar pagamento com categoria "cara" quando valor maior que 100', () => {

    // Arrange
    const servico = new ServicoDePagamento();

    // Act
    servico.pagar('0987-7656-3475', 'Samar', 156.87);
    const resultado = servico.consultarUltimoPagamento();

    // Assert
    assert.deepStrictEqual(resultado, {
      codigoBarras: '0987-7656-3475',
      empresa: 'Samar',
      valor: 156.87,
      categoria: 'cara',
    });
  });

  it('2) pagar: deve armazenar pagamento com categoria "padrão" quando valor menor ou igual a 100', () => {

    // Arrange
    const servico = new ServicoDePagamento();

    // Act
    servico.pagar('1234-5678-9012', 'Empresa X', 50.00);
    const resultado = servico.consultarUltimoPagamento();

    // Assert
    assert.deepStrictEqual(resultado, {
      codigoBarras: '1234-5678-9012',
      empresa: 'Empresa X',
      valor: 50.00,
      categoria: 'padrão',
    });
  });

  it('3) pagar: deve armazenar pagamento com categoria "padrão" quando valor igual a 100', () => {

    // Arrange
    const servico = new ServicoDePagamento();

    // Act
    servico.pagar('1111-2222-3333', 'Empresa Y', 100.00);
    const resultado = servico.consultarUltimoPagamento();

    // Assert
    assert.strictEqual(resultado.categoria, 'padrão');
  });

  it('4) consultarUltimoPagamento: deve retornar apenas o último pagamento realizado', () => {

    // Arrange
    const servico = new ServicoDePagamento();

    // Act
    servico.pagar('0000-0000-0001', 'Empresa A', 30.00);
    servico.pagar('0000-0000-0002', 'Empresa B', 200.00);
    servico.pagar('0000-0000-0003', 'Empresa C', 75.50);
    const resultado = servico.consultarUltimoPagamento();

    // Assert
    assert.deepStrictEqual(resultado, {
      codigoBarras: '0000-0000-0003',
      empresa: 'Empresa C',
      valor: 75.50,
      categoria: 'padrão',
    });
  });

  it('5) consultarUltimoPagamento: deve retornar undefined quando nenhum pagamento foi realizado', () => {

    // Arrange
    const servico = new ServicoDePagamento();

    // Act
    const resultado = servico.consultarUltimoPagamento();

    // Assert
    assert.strictEqual(resultado, undefined);
  });

  it('6) pagar: deve armazenar corretamente todas as propriedades do pagamento', () => {

    // Arrange
    const servico = new ServicoDePagamento();

    // Act
    servico.pagar('9999-8888-7777', 'Conta de Luz', 250.00);
    const resultado = servico.consultarUltimoPagamento();

    // Assert
    assert.ok('codigoBarras' in resultado);
    assert.ok('empresa' in resultado);
    assert.ok('valor' in resultado);
    assert.ok('categoria' in resultado);
  });
});
