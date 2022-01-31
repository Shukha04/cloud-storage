export default (size) => {
	if (size > 1024 * 1024 * 1024) {
		return (size / (1024 * 1024 * 1024)).toFixed(1) + 'GB'
	}
	if (size > 1024 * 1024) {
		return (size / (1024 * 1024)).toFixed(1) + 'MB'
	}
	if (size > 1024 * 1024) {
		return (size / (1024 * 1024)).toFixed(1) + 'KB'
	}
	return size + 'B'
}