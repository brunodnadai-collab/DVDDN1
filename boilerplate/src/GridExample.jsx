import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FixedSizeGrid as Grid } from 'react-window'
import { HyperFormula } from 'hyperformula'

/*
  Exemplo demonstrativo:
  - Usa react-window para virtualização de grade
  - Cria uma instância HyperFormula para avaliação de algumas células
  Observação: esta é uma integração exemplo; ajustes na API do HyperFormula podem ser necessários
  dependendo da versão instalada. A ideia é demonstrar a arquitetura.
*/

const COL_COUNT = 100
const ROW_COUNT = 1000
const COL_WIDTH = 100
const ROW_HEIGHT = 30

function cellAddress(col, row) {
  // Col A, B, C...
  const letters = []
  let c = col + 1
  while (c > 0) {
    const mod = (c - 1) % 26
    letters.unshift(String.fromCharCode(65 + mod))
    c = Math.floor((c - 1) / 26)
  }
  return `${letters.join('')}${row + 1}`
}

export default function GridExample() {
  const [hf, setHf] = useState(null)
  const [dataDraft, setDataDraft] = useState({}) // map 'A1' -> content string
  const gridRef = useRef(null)

  useEffect(() => {
    // Inicializa HyperFormula (v1 API). Se sua versão requer opções diferentes, ajuste aqui.
    try {
      const instance = HyperFormula.buildEmpty()
      // Adiciona uma sheet padrão
      instance.addSheet('S')
      setHf(instance)

      // prepopula alguns valores de exemplo
      instance.setCellContents({ sheet: 0, col: 0, row: 0 }, '1') // A1 = 1
      instance.setCellContents({ sheet: 0, col: 1, row: 0 }, '2') // B1 = 2
      instance.setCellContents({ sheet: 0, col: 2, row: 0 }, '=A1+B1') // C1 = formula
    } catch (e) {
      console.warn('Erro ao iniciar HyperFormula (verifique a versão):', e)
    }
  }, [])

  // helper para obter valor avaliado (fallback para conteúdo bruto)
  const getEvaluated = (col, row) => {
    const addr = cellAddress(col, row)
    if (hf) {
      try {
        // Tenta ler o valor avaliado; API pode variar por versão.
        const value = hf.getCellValue({ sheet: 0, col, row })
        return value !== undefined ? String(value) : (dataDraft[addr] || '')
      } catch (e) {
        // fallback
        return dataDraft[addr] || ''
      }
    }
    return dataDraft[addr] || ''
  }

  // Render cell
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const addr = cellAddress(columnIndex, rowIndex)
    const val = getEvaluated(columnIndex, rowIndex)
    return (
      <div style={{ ...style, boxSizing: 'border-box', border: '1px solid #eee', padding: 6, fontSize: 12 }}>
        <div style={{ fontSize: 11, color: '#666' }}>{addr}</div>
        <div>{val}</div>
      </div>
    )
  }

  return (
    <div style={{ height: '70vh', width: '100%', marginTop: 12 }}>
      <div style={{ marginBottom: 8 }}>
        <strong>Grid virtualizado + HyperFormula (exemplo)</strong>
      </div>
      <Grid
        ref={gridRef}
        columnCount={COL_COUNT}
        columnWidth={COL_WIDTH}
        height={600}
        rowCount={ROW_COUNT}
        rowHeight={ROW_HEIGHT}
        width={Math.min(COL_COUNT * COL_WIDTH, 1000)}
      >
        {Cell}
      </Grid>
      <p style={{ marginTop: 8, fontSize: 13 }}>
        Observação: este é um exemplo inicial. Para edição inline, bindings com HyperFormula (setCellContents/getCellValue)
        e recalculo incremental são necessários — posso ajudar a completar essa integração com base na versão do HyperFormula que você instalar.
      </p>
    </div>
  )
}
