from numpy import size
# ==========================================
# DASHBOARD REAL - ACIDENTES EM RECIFE
# ==========================================

import json
import pandas as pd
import plotly.express as px
from plotly.subplots import make_subplots
import plotly.graph_objects as go

# ==========================================
# CARREGAR JSON
# ==========================================

with open("dados-bairros.json", "r", encoding="utf-8") as arquivo:
    dados = json.load(arquivo)

# ==========================================
# TRANSFORMAR JSON
# ==========================================

linhas = []

for bairro, info in dados.items():

    regiao = info.get("regiao", "Sem região")

    for ano, dados_ano in info["anos"].items():

        acidentes_texto = dados_ano.get("acidentes", "")

        if acidentes_texto and acidentes_texto.strip() != "":

            try:

                numero = int(acidentes_texto.split()[0])

                linhas.append({
                    "bairro": bairro,
                    "regiao": regiao,
                    "ano": int(ano),
                    "acidentes": numero
                })

            except:
                pass

df = pd.DataFrame(linhas)

# ==========================================
# DADOS DOS GRÁFICOS
# ==========================================

# TOP BAIRROS
bairro_df = (
    df.groupby("bairro")["acidentes"]
    .sum()
    .sort_values(ascending=False)
    .head(10)
    .reset_index()
)

# EVOLUÇÃO ANUAL
ano_df = (
    df.groupby("ano")["acidentes"]
    .sum()
    .reset_index()
)

# REGIÕES
regiao_df = (
    df.groupby("regiao")["acidentes"]
    .sum()
    .reset_index()
)

# ==========================================
# KPI
# ==========================================

total_acidentes = df["acidentes"].sum()
total_bairros = df["bairro"].nunique()
total_regioes = df["regiao"].nunique()

# ==========================================
# CRIAR DASHBOARD
# ==========================================

fig = make_subplots(
    rows=2,
    cols=2,
    specs=[
        [{"type": "bar"}, {"type": "pie"}],
        [{"type": "scatter"}, {"type": "indicator"}]
    ],
    subplot_titles=(
        "<b>Top 10 Bairros<b>",
        "<b>Acidentes por Região<b>",
        "<b>Evolução Anual<b>",
        "<b>Indicadores<b>"
    )
)

# ==========================================
# GRÁFICO 1 - BARRAS
# ==========================================

fig.add_trace(

    go.Bar(
        x=bairro_df["bairro"],
        y=bairro_df["acidentes"],
        marker=dict(
            color=bairro_df["acidentes"],
            colorscale="Blues",
            line=dict(color="white", width=1)),
        name="Bairros"
    ),

    row=1,
    col=1
)

# ==========================================
# GRÁFICO 2 - PIZZA
# ==========================================

fig.add_trace(

    go.Pie(
    labels=regiao_df["regiao"],
    values=regiao_df["acidentes"],
    hole=0,
    marker=dict(colors=px.colors.sequential.BuGn),
    textinfo="percent+label"
),

    row=1,
    col=2
)

# ==========================================
# GRÁFICO 3 - LINHA
# ==========================================

fig.add_trace(

    go.Scatter(
    x=ano_df["ano"],
    y=ano_df["acidentes"],
    mode="lines+markers",
    line=dict(color="#00d4ff", width=4),
    marker=dict(size=8, color="white"),
    name="Evolução"
),

    row=2,
    col=1
)

# ==========================================
# KPI INDICADOR
# ==========================================

fig.add_trace(

    go.Indicator(
        mode="number",
        value=total_acidentes,
        title={"text": "Total de Acidentes"}
    ),

    row=2,
    col=2
)

# ==========================================
# LAYOUT
# ==========================================

fig.update_layout(

    title={
        "text": "Dashboard de Acidentes em Recife",
        "x": 0.5,
        "font": {"size": 28, "family": "Arial Black"}
    },

    height=900,

    template="plotly_white",
    paper_bgcolor="#F0F0F0",
    plot_bgcolor="#0f1117",

    margin=dict(l=40, r=40, t=80, b=40)
)
fig.update_layout(

    shapes=[

        dict(
            type="rect",
            xref="paper", yref="paper",
            x0=0.00, x1=0.48,
            y0=0.52, y1=1.00,
            fillcolor="#FFFFFF",
            line=dict(color="#FFFFFF"),
            layer="below"
        ),

        # card 2 (top-right)
        dict(
            type="rect",
            xref="paper", yref="paper",
            x0=0.52, x1=1.00,
            y0=0.52, y1=1.00,
            fillcolor="#FFFFFF",
            line=dict(color="#FFFFFF"),
            layer="below"
        ),

        # card 3 (bottom-left)
        dict(
            type="rect",
            xref="paper", yref="paper",
            x0=0.00, x1=0.48,
            y0=0.00, y1=0.48,
            fillcolor="#FFFFFF",
            line=dict(color="#FFFFFF"),
            layer="below"
        ),

        # card 4 (bottom-right)
        dict(
            type="rect",
            xref="paper", yref="paper",
            x0=0.52, x1=1.00,
            y0=0.00, y1=0.48,
            fillcolor="#FFFFFF",
            line=dict(color="#FFFFFF"),
            layer="below"
        )
    ],
    font=dict(
        family="Inter, Arial",
        size=12,
        color="black"
    )

)



fig.update_layout(

    showlegend=False,

    template="plotly_white"
)

# ==========================================
# MOSTRAR DASHBOARD
# ==========================================

fig.show()
