// Mechanical acceptance only. Voice, factual accuracy and visual quality need editorial review.
export function editorialFindings(html, assetExists) {
  const issues = []
  const article = html.match(/<article\b[\s\S]*?<\/article>/)?.[0] || ''
  if (!article.includes('ed-guide')) issues.push('shared editorial article structure')
  if (/REPLACE_[A-Z_]+/.test(html)) issues.push('unresolved template placeholder')
  if (!article.includes('data-editorial-contents')) issues.push('contents navigation')
  if ((article.match(/class="ed-choice-art /g) || []).length !== 3) issues.push('three compact illustrated cards')
  const images = [...article.matchAll(/<img\b[^>]*>/g)].map(match => match[0])
  if (images.length < 3) issues.push('explanatory image coverage')
  for (const img of images) {
    if (!/alt="[^"\s][^"]*"/.test(img)) issues.push('meaningful image alt text')
    const src = img.match(/src="([^"]+)"/)?.[1]
    if (!src?.startsWith('/img/guides/') || !assetExists(src)) issues.push('existing explanatory image asset')
  }
  if (article.includes('guide-service')) issues.push('no in-article sales panel')
  if ((article.match(/href="(?:https:\/\/nakedtech.au)?\/services\//g) || []).length > 1) issues.push('at most one optional service link')
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])
  if (new Set(ids).size !== ids.length) issues.push('unique IDs')
  for (const [, target] of article.matchAll(/href="#([^"]+)"/g)) {
    if (!ids.includes(target)) issues.push(`existing anchor target #${target}`)
  }
  return [...new Set(issues)]
}
