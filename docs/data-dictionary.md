# Data Dictionary — CBL Mnemonics

Every CBL series used in the TrueRate codebase. The `Mnemonic` is the key into `cbl_observations`.

## Exchange Rates (EXR)

| Mnemonic | Name | Units | Frequency | Interpretation Rule |
|----------|------|-------|-----------|-------------------|
| `LBR_EXR_EPR_1` | Market Rate End of Period | LRD per USD | Monthly | <!-- TODO --> |
| `LBR_EXR_PAR_1` | Market Rate Period Average | LRD per USD | Monthly | <!-- TODO --> |

## Consumer Prices (CPI)

| Mnemonic | Name | Units | Frequency | Interpretation Rule |
|----------|------|-------|-----------|-------------------|
| `LBR_CPI_0` | Consumer Price Index | Index | Monthly | <!-- TODO --> |

## Interest Rates (INR)

| Mnemonic | Name | Units | Frequency | Interpretation Rule |
|----------|------|-------|-----------|-------------------|
| `LBR_INR_MPR_1` | Monetary Policy Rate | % | Monthly | <!-- TODO --> |
| `LBR_INR_LRL_2` | Lending Rate (LRD) | % | Monthly | <!-- TODO --> |
| `LBR_INR_LRU_8` | Lending Rate (USD) | % | Monthly | <!-- TODO --> |
| `LBR_INR_PRL_3` | Personal Loan Rate (LRD) | % | Monthly | <!-- TODO --> |
| `LBR_INR_PRU_9` | Personal Loan Rate (USD) | % | Monthly | <!-- TODO --> |
| `LBR_INR_MRL_4` | Mortgage Rate (LRD) | % | Monthly | <!-- TODO --> |
| `LBR_INR_MRU_10` | Mortgage Rate (USD) | % | Monthly | <!-- TODO --> |
| `LBR_INR_DRL_5` | Time Deposit Rate (LRD) | % | Monthly | <!-- TODO --> |
| `LBR_INR_DRU_11` | Time Deposit Rate (USD) | % | Monthly | <!-- TODO --> |
| `LBR_INR_SRL_6` | Savings Rate (LRD) | % | Monthly | <!-- TODO --> |
| `LBR_INR_SRU_12` | Savings Rate (USD) | % | Monthly | <!-- TODO --> |
| `LBR_INR_CRL_7` | CD Rate (LRD) | % | Monthly | <!-- TODO --> |
| `LBR_INR_CRU_13` | CD Rate (USD) | % | Monthly | <!-- TODO --> |

## Monetary (MON)

| Mnemonic | Name | Units | Frequency | Interpretation Rule |
|----------|------|-------|-----------|-------------------|
| `LBR_MON_6` | Reserve Money (Monetary Base) | Millions LRD | Monthly | <!-- TODO --> |
| `LBR_MON_DC_4` | Broad Money (M2) | Millions LRD | Monthly | <!-- TODO --> |

## Fiscal (FIS)

| Mnemonic | Name | Units | Frequency | Interpretation Rule |
|----------|------|-------|-----------|-------------------|
| `LBR_FIS_DEBT_1` | Total Government Debt | Millions USD | Monthly | <!-- TODO --> |
| `LBR_FIS_DEBT_1_2` | Domestic Debt | Millions USD | Monthly | <!-- TODO --> |
| `LBR_FIS_DEBT_1_3` | External Debt | Millions USD | Monthly | <!-- TODO --> |
| `LBR_FIS_BUD_1` | Total Government Revenue | Millions USD | Monthly | <!-- TODO --> |
| `LBR_FIS_BUD_2` | Total Government Expenditure | Millions USD | Monthly | <!-- TODO --> |

## Balance of Payments (BOP)

| Mnemonic | Name | Units | Frequency | Interpretation Rule |
|----------|------|-------|-----------|-------------------|
| `LBR_BOP_1_4` | Goods Trade Balance | Millions USD | Quarterly | <!-- TODO --> |
| `LBR_BOP_1_4_1` | Goods Exports | Millions USD | Quarterly | <!-- TODO --> |
| `LBR_BOP_1_4_2` | Goods Imports | Millions USD | Quarterly | <!-- TODO --> |

## National Accounts (NAT)

| Mnemonic | Name | Units | Frequency | Interpretation Rule |
|----------|------|-------|-----------|-------------------|
| `LBR_NAT_0` | GDP at Market Prices (Nominal) | Millions USD | Annual | <!-- TODO --> |
| `LBR_NAT_00` | GDP at Constant 1992 Prices (Real) | Millions LRD | Annual | <!-- TODO --> |

---

## How to use this dictionary

- The **Mnemonic** is the lookup key in `cbl_observations.mnemonic`.
- **Units** describe what the raw `value` column represents — apply scaling factors in code (e.g. `* 1e-3` to convert Millions → Billions for display).
- **Interpretation Rule** (to be filled) describes the editorial heuristic: what constitutes a significant move, what audience cares, what comparison to draw. This is the bridge from fact to interpretation.
