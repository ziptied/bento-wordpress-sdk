module.exports = async ({github, context}) => {
    // Get the latest tag
    const { data: tags } = await github.rest.repos.listTags({
        owner: context.repo.owner,
        repo: context.repo.repo,
        per_page: 1
    });

    const latestTag = tags[0]?.name || '';

    // Get commits since last tag
    const { data: commits } = await github.rest.repos.compareCommits({
        owner: context.repo.owner,
        repo: context.repo.repo,
        base: latestTag || 'master~1',
        head: 'master'
    });

    // Get PRs
    const { data: pulls } = await github.rest.pulls.list({
        owner: context.repo.owner,
        repo: context.repo.repo,
        state: 'closed',
        sort: 'updated',
        direction: 'desc',
        per_page: 100
    });

    // Filter merged PRs since last release
    const mergedPRs = pulls.filter(pr => {
        return pr.merged_at && (!latestTag || new Date(pr.merged_at) > new Date(tags[0]?.created_at));
    });

    // Categorize changes
    const categories = {
        '🚀 New Features': {
            commits: commits.commits.filter(commit => commit.commit.message.startsWith('feat')),
            prs: mergedPRs.filter(pr =>
                pr.labels.some(label => label.name.includes('feature') || label.name.includes('enhancement'))
            )
        },
        '🐛 Bug Fixes': {
            commits: commits.commits.filter(commit => commit.commit.message.startsWith('fix')),
            prs: mergedPRs.filter(pr => pr.labels.some(label => label.name.includes('bug')))
        },
        '📚 Documentation': {
            commits: commits.commits.filter(commit => commit.commit.message.startsWith('docs')),
            prs: mergedPRs.filter(pr => pr.labels.some(label => label.name.includes('documentation')))
        },
        '🔧 Maintenance': {
            commits: commits.commits.filter(commit =>
                commit.commit.message.startsWith('chore') ||
                commit.commit.message.startsWith('refactor') ||
                commit.commit.message.startsWith('style')
            ),
            prs: mergedPRs.filter(pr =>
                pr.labels.some(label =>
                    label.name.includes('maintenance') ||
                    label.name.includes('chore') ||
                    label.name.includes('refactor')
                )
            )
        }
    };

    // Generate markdown
    let markdown = '## What\'s Changed\n\n';

    // Add breaking changes first if any
    const breakingChanges = [
        ...commits.commits.filter(commit => commit.commit.message.includes('BREAKING CHANGE')),
        ...mergedPRs.filter(pr => pr.labels.some(label => label.name.includes('breaking')))
    ];

    if (breakingChanges.length > 0) {
        markdown += '⚠️ **Breaking Changes**\n\n';
        breakingChanges.forEach(change => {
            if ('number' in change) { // It's a PR
                markdown += `* ${change.title} (#${change.number})\n`;
            } else { // It's a commit
                const breakingChangeDesc = change.commit.message.split('BREAKING CHANGE:')[1]?.trim();
                markdown += `* ${breakingChangeDesc || change.commit.message}\n`;
            }
        });
        markdown += '\n';
    }

    // Add categorized changes
    for (const [category, items] of Object.entries(categories)) {
        if (items.commits.length > 0 || items.prs.length > 0) {
            markdown += `### ${category}\n\n`;

            // Add PRs first
            items.prs.forEach(pr => {
                markdown += `* ${pr.title} (#${pr.number}) @${pr.user.login}\n`;
            });

            // Add commits that aren't associated with PRs
            items.commits
                .filter(commit => !items.prs.some(pr => pr.merge_commit_sha === commit.sha))
                .forEach(commit => {
                    const firstLine = commit.commit.message.split('\n')[0];
                    markdown += `* ${firstLine} (${commit.sha.substring(0, 7)}) @${commit.author?.login || commit.commit.author.name}\n`;
                });

            markdown += '\n';
        }
    }

    // Add contributors section
    const contributors = new Set([
        ...mergedPRs.map(pr => pr.user.login),
        ...commits.commits.map(commit => commit.author?.login || commit.commit.author.name)
    ]);

    if (contributors.size > 0) {
        markdown += '## Contributors\n\n';
        [...contributors].forEach(contributor => {
            markdown += `* ${contributor.includes('@') ? contributor : '@' + contributor}\n`;
        });
    }

    return markdown;
}