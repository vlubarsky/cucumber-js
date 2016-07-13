export default class DataTable {
  constructor(data) {
    this.rawTable = data.rows.map((row) => row.cells.map((cell) => cell.value))
  }

  getType() {
    return 'DataTable'
  }

  hashes() {
    const copy = this.raw()
    const keys = copy[0]
    const valuesArray = copy.slice(0)
    return valuesArray.map((values) => _.zipObject(keys, values))
  }

  raw () {
    return rawTable.slice(0)
  }

  rows() {
    const copy = this.raw()
    copy.shift()
    return copy
  }

  rowsHash() {
    const rows = self.raw()
    const everyRowHasTwoColumns = _.all(rows, (row) => row.length === 2)
    if (!everyRowHasTwoColumns) {
      throw new Error('rowsHash can only be called on a data table where all rows have exactly two columns')
    }
    return _.fromPairs(rows)
  }
}
