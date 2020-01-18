const filters = {
  sizeFormat(size: number) {
    // 转换字节
    if (!size) return size
    let res: string = ''
    if (size >= 1024 * 1024) {
      res = `${(size / 10204 / 1024).toFixed(2)} MB`
    } else if (size >= 1024) {
      res = `${(size / 1024).toFixed(2)} KB`
    } else if (size < 1024) {
      res = `${size.toFixed(2)} B`
    }
    return res
  }
}

export default filters
