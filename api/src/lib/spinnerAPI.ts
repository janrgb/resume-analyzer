import Spinner from 'resume-analyzer\web\src\components\Spinner'
const fetchData = async () => {
    setLoading(true) // Show spinner
    setError(null) // Reset error state

    try {
      const response = await fetch('/api/resume-analysis') // Replace with your API URL
      if (!response.ok) {
        throw new Error('Failed to fetch data') // Handle non-2xx responses
      }
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err.message) // Capture error message
    } finally {
      setLoading(false) // Hide spinner
    }
  }