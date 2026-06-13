# pgats-ci-exam — Pipeline de Integração Contínua com GitHub Actions

Trabalho de conclusão da disciplina de Integração Contínua da pós-graduação PGATS.

---

## Sobre o Projeto

Projeto em JavaScript que simula um **serviço de pagamento**, permitindo realizar pagamentos e consultar o último pagamento registrado. A classe `ServicoDePagamento` categoriza automaticamente cada pagamento como `"cara"` (valor > R$ 100) ou `"padrão"` (valor ≤ R$ 100).

A suite de testes é composta por **6 casos de teste** escritos com **Mocha**, cobrindo os comportamentos principais da classe.

---

## Estrutura do Projeto

```
pgats-ci-exam/
├── .github/
│   └── workflows/
│       ├── 01-push-exec.yaml      # Pipeline por push
│       ├── 02-manual-exec.yaml    # Pipeline manual
│       └── 03-schedule.yaml       # Pipeline agendada
├── src/
│   └── servicoDePagamento.js      # Código-fonte
├── test/
│   └── servicoDePagamento.test.js # Testes automatizados
├── reports/                       # Relatórios gerados localmente
└── package.json
```

---

## Pipelines — GitHub Actions

### 1. Execução por Push (`01-push-exec.yaml`)

Disparada automaticamente a cada `push` na branch `main`. Garante que nenhuma alteração quebre os testes antes de integrar ao código principal.

```yaml
on:
  push:
    branches:
      - main
```

### 2. Execução Manual (`02-manual-exec.yaml`)

Disparada manualmente pelo desenvolvedor através da aba **Actions** no GitHub, usando o gatilho `workflow_dispatch`. Útil para revalidar o estado da aplicação sob demanda, sem necessidade de um novo commit.

```yaml
on:
  workflow_dispatch:
```

### 3. Execução Agendada (`03-schedule.yaml`)

Disparada automaticamente **a cada 5 minutos** via expressão cron. Garante execução periódica dos testes mesmo sem atividade no repositório, identificando regressões causadas por fatores externos (atualizações de dependências, por exemplo).

```yaml
on:
  schedule:
    - cron: '*/5 * * * *'
```

---

## Relatório de Testes

Os testes utilizam o reporter **Mochawesome**, que gera um relatório HTML interativo ao final de cada execução. O relatório é salvo na pasta `reports/` e publicado como **artifact** na pipeline, ficando disponível para download por **30 dias** diretamente na aba Actions do GitHub.

A etapa de upload usa `if: always()` para garantir que o relatório seja publicado mesmo quando há falhas nos testes.

```yaml
- name: Upload test report
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: relatorio-testes
    path: reports/
    retention-days: 30
```

---

## Conceitos Aplicados

| Conceito | Descrição |
|---|---|
| **Integração Contínua (CI)** | Prática de integrar e validar o código automaticamente a cada alteração, reduzindo o risco de regressões |
| **GitHub Actions** | Plataforma de automação integrada ao GitHub para criação de pipelines de CI/CD |
| **Workflow** | Arquivo YAML que define os gatilhos, jobs e steps de uma pipeline |
| **Trigger / Gatilho** | Evento que inicia a execução de um workflow (`push`, `workflow_dispatch`, `schedule`) |
| **Job** | Unidade de trabalho dentro de um workflow, executada em uma máquina virtual isolada |
| **Step** | Passo individual dentro de um job; pode ser um comando shell ou uma Action reutilizável |
| **Action** | Componente reutilizável do GitHub Actions (ex: `actions/checkout`, `actions/upload-artifact`) |
| **Runner** | Máquina virtual que executa os jobs (`ubuntu-latest`) |
| **Cron** | Expressão de agendamento no formato Unix usada para definir recorrência de execução |
| **Artifact** | Arquivo gerado durante a pipeline e armazenado no GitHub para consulta posterior |
| **Mochawesome** | Reporter do Mocha que gera relatórios HTML detalhados sobre a execução dos testes |

---

## Cenários Cobertos nos Testes

1. Pagamento com valor acima de R$ 100 → categoria `'cara'`
2. Pagamento com valor abaixo de R$ 100 → categoria `'padrão'`
3. Pagamento com valor exatamente igual a R$ 100 → categoria `'padrão'`
4. Múltiplos pagamentos → retorna apenas o último
5. Nenhum pagamento realizado → retorna `undefined`
6. Objeto do pagamento contém todas as propriedades esperadas

---

## Como Executar Localmente

**Pré-requisitos:** Node.js 20+ e Yarn instalados.

```bash
# Instalar dependências
yarn

# Executar testes e gerar relatório
yarn test
```

O relatório HTML será gerado em `reports/resultado.html`.

---

## Tecnologias Utilizadas

- **Node.js** — Ambiente de execução JavaScript (ES Modules)
- **Mocha** — Framework de testes
- **Mochawesome** — Reporter de testes com saída HTML
- **node:assert** — Módulo nativo de asserções
- **GitHub Actions** — Plataforma de CI/CD
- **Yarn** — Gerenciador de pacotes
