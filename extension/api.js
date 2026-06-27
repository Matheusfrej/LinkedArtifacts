const $api = { 
  listPapersByTitles: async (params = { titles: [''] }) => {
    const response = await fetch(`${$constant.API_URL}/papers/by-titles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titles: params.titles })
    });

    if (!response.ok) {
      $logger.error("$api.listPapersByTitles", 'API error:', response.status);
      return [];
    }

    const papers = await response.json();
    $logger.info("$api.listPapersByTitles", 'Received papers:', papers);

    return papers;
  }

}