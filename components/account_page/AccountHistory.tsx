import { useState } from 'react'
import TradeHistoryTable from '../TradeHistoryTable'
import { useTranslation } from 'next-i18next'
import useTradeHistory from '../../hooks/useTradeHistory'
import Button from '../Button'
import { SaveIcon } from '@heroicons/react/solid'
import { ExportToCsv } from 'export-to-csv'

// const historyViews = ['Trades', 'Deposits', 'Withdrawals', 'Liquidations']

export default function AccountHistory() {
  const { t } = useTranslation('common')
  const [view] = useState('Trades')
  const tradeHistory = useTradeHistory({ excludePerpLiquidations: true })

  const exportTradeHistoryAsCSV = () => {
    const dataToExport = tradeHistory.map((trade) => {
      return {
        asset: trade.marketName,
        orderType: trade.side.toUpperCase(),
        quantity: trade.size,
        price: trade.price,
        value: trade.value,
        liquidity: trade.liquidity,
        fee: trade.fee,
        date: trade.loadTimestamp,
      }
    })

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      filename: 'Mango Markets - Trade History - ' + new Date().toString(),
      useTextFile: false,
      useBom: true,
      headers: [
        'Market',
        'Side',
        'Size',
        'Price',
        'Value',
        'Liquidity',
        'Fee',
        'Approx. Time',
      ],
    }

    const exporter = new ExportToCsv(options)
    exporter.generateCsv(dataToExport)
  }

  return (
    <>
      <div className="pb-8 text-th-fgd-1 text-base">
        {t('trade-history')}
        <Button
          className={`float-right text-sm`}
          onClick={exportTradeHistoryAsCSV}
        >
          <div className={`flex items-center`}>
            {t('export-data')}
            <SaveIcon className={`h-4 w-4 ml-1.5`} />
          </div>
        </Button>
      </div>
      {/* Todo: add this back when the data is available */}
      {/* <div className="flex">
          {historyViews.map((section) => (
            <div
              className={`border px-3 py-1.5 mr-2 rounded cursor-pointer default-transition
              ${
                view === section
                  ? `bg-th-bkg-3 border-th-bkg-3 text-th-primary`
                  : `border-th-fgd-4 text-th-fgd-1 opacity-80 hover:opacity-100`
              }
            `}
              onClick={() => setView(section)}
              key={section as string}
            >
              {section}
            </div>
          ))}
        </div> */}
      <ViewContent view={view} />
    </>
  )
}

const ViewContent = ({ view }) => {
  const { t } = useTranslation('common')

  switch (view) {
    case 'Trades':
      return <TradeHistoryTable />
    case 'Deposits':
      return <div>{t('deposits')}</div>
    case 'Withdrawals':
      return <div>{t('withdrawals')}</div>
    case 'Liquidations':
      return <div>{t('liquidations')}</div>
    default:
      return <TradeHistoryTable />
  }
}
