module.exports = async ({github, context}) => {
    // Get the latest tag
    const { data: tags } = await github.rest.repos.listTags({
        owner: context.repo.owner,
        repo: context.repo.repo,
        per_page: 1
    });

    const latestTag = tags[0]?.name || '';

    // Get all PRs merged since the last tag
    const { data: pulls } = await github.rest.pulls.list({
        owner: context.repo.owner,
        repo: context.repo.repo,
        state: 'closed',
        sort: 'updated',
        direction: 'desc',
        per_page: 100
    });

    // Filter PRs that were merged after the last release
    const mergedPRs = pulls.filter(pr => {
        return pr.merged_at && (!latestTag || new Date(pr.merged_at) > new Date(latestTag.created_at));
    });

    // Categories for changes
    const categories = {
        'Features': mergedPRs.filter(pr => pr.labels.some(label => label.name.includes('feature'))),
        'Bug Fixes': mergedPRs.filter(pr => pr.labels.some(label => label.name.includes('bug'))),
        'Documentation': mergedPRs.filter(pr => pr.labels.some(label => label.name.includes('documentation'))),
        'Other Changes': mergedPRs.filter(pr =>
            !pr.labels.some(label =>
                label.name.includes('feature') ||
                label.name.includes('bug') ||
                label.name.includes('documentation')
            )
        )
    };

    // Get unique contributors
    const contributors = [...new Set(mergedPRs.map(pr => pr.user.login))];

    // Generate markdown
    let markdown = '## What\'s Changed\n\n';

    for (const [category, prs] of Object.entries(categories)) {
        if (prs.length > 0) {
            markdown += `### ${category}\n\n`;
            prs.forEach(pr => {
                markdown += `* ${pr.title} (#${pr.number}) by @${pr.user.login}\n`;
            });
            markdown += '\n';
        }
    }

    if (contributors.length > 0) {
        markdown += '## Contributors\n\n';
        contributors.forEach(contributor => {
            markdown += `* @${contributor}\n`;
        });
    }

    // Add breaking changes section if any PR has breaking change label
    const breakingChanges = mergedPRs.filter(pr =>
        pr.labels.some(label => label.name.includes('breaking'))
    );

    if (breakingChanges.length > 0) {
        markdown = '⚠️ This release contains breaking changes!\n\n' + markdown;
        markdown += '\n## Breaking Changes\n\n';
        breakingChanges.forEach(pr => {
            markdown += `* ${pr.title} (#${pr.number})\n`;
        });
    }

    return markdown;
}