const $api = { 
  fetchDOI: async (parms = {
    title: ''
  }) => {
    let result = '123'

    $logger.info('$api.fetchDOI', { parms, result })
    return result;
  }, 

  fetchArtifacts: async (parms = {
    doi: ''
  }) => {
    const result = [
      {
        url: 'https://www.google.com',
        label: 'Dataset'
      },
      {
        url: 'https://www.google.com',
        label: 'Code'
      },
    ]

    $logger.info('$api.fetchArtifacts', { parms, result })
    return result;
  }

}