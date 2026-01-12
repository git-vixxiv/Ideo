# NotebookLM Integration Guide

This project now has a NotebookLM skill integrated with Claude Code, allowing you to interact with Google's NotebookLM Enterprise API directly from your development environment.

## Quick Start

### Using the Skill

Invoke the NotebookLM skill in Claude Code using:
```
/notebooklm
```

Or mention NotebookLM-related tasks and Claude will automatically use the skill when appropriate.

## What You Can Do

The NotebookLM skill enables you to:

1. **Create Research Notebooks** - Organize documents and sources for analysis
2. **Upload Data Sources** - Add PDFs, Google Docs, web URLs, and text files
3. **Query Information** - Ask questions and get AI-powered answers with citations
4. **Generate Audio Summaries** - Create podcast-style audio summaries from your sources
5. **Manage Notebooks** - List, update, and share notebooks

## Setup Requirements

Before using the NotebookLM skill, you need:

### 1. Google Cloud Project
- Create a Google Cloud project
- Enable NotebookLM Enterprise API
- Note your project number

### 2. Authentication
Set up Google Cloud credentials:
```bash
gcloud auth application-default login
```

Or use a service account:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
```

### 3. Environment Variables
Create a `.env.local` file with:
```bash
GOOGLE_CLOUD_PROJECT_NUMBER=your-project-number
GOOGLE_CLOUD_LOCATION=us-central1
NOTEBOOKLM_ENDPOINT_LOCATION=us-central1
```

## Example Use Cases

### Analyze Research Papers
```
Hey Claude, use NotebookLM to create a notebook called "AI Research 2026"
and add these three PDFs to it: paper1.pdf, paper2.pdf, paper3.pdf
```

### Query Your Documentation
```
In my NotebookLM notebook, find all mentions of authentication methods
and summarize the different approaches
```

### Generate Audio Summary
```
Create a podcast-style audio summary of my NotebookLM notebook
about the Q4 product roadmap
```

## API Reference

The skill uses Google Cloud's NotebookLM Enterprise API:
- **Endpoint**: `https://LOCATION-discoveryengine.googleapis.com/v1alpha`
- **Documentation**: https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/api-notebooks

## Features

### ✅ Supported Operations
- Create and manage notebooks
- Add data sources (Google Drive, PDFs, URLs, text)
- Query notebooks with natural language
- Generate audio summaries
- List and retrieve notebooks
- Share notebooks with team members

### 🔄 Coming Soon
- Batch source uploads
- Custom audio generation parameters
- Webhook integrations
- Advanced citation formatting

## Troubleshooting

### Authentication Errors (401)
```bash
gcloud auth application-default login
gcloud auth application-default print-access-token
```

### Permission Errors (403)
Verify NotebookLM Enterprise is enabled:
```bash
gcloud services enable discoveryengine.googleapis.com
```

### Network Access
Make sure Claude Code has network permissions enabled in settings.

## Security Notes

- Never commit credentials or API keys to git
- Use environment variables for sensitive data
- Service accounts should have minimal required permissions
- Review Google Cloud IAM policies regularly

## Need Help?

The NotebookLM skill is available at: `~/.claude/skills/notebooklm/SKILL.md`

For questions or issues, refer to:
- [NotebookLM API Docs](https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs)
- [Setup Guide](https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/set-up-notebooklm)

---

**Network Access Enabled**: ✅ The NotebookLM skill can make API calls to Google Cloud services.
