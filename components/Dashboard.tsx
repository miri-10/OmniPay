// app/components/Dashboard.tsx
"use client"
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Header from './Header';
import ChatPanel from './ChatPanel';
import OrganizationsPanel from './OrganizationsPanel';
import { Menu } from 'lucide-react';
import { Message, PayrollSummary, WorkerSummary } from '@/utils/interface';
import { blockchainMcpTools, setWalletContext } from '@/lib/payroll-mcp-tools';
import Footer from './Footer';
import { getCluster } from '@/utils/helper';
import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { DEFAULT_MODEL } from '@/lib/open-source-ai-provider';

type ChatMessage = Message & {
  id: string;
};

const formatToolResponse = (toolName: string, toolArgs: Record<string, unknown>, toolOutput: unknown, cluster: string): string => {
  const lines: string[] = [];
  const clusterParam = `cluster=${cluster}`;

  let outputData: Record<string, unknown> = {};
  if (typeof toolOutput === 'string') {
    try {
      outputData = JSON.parse(toolOutput);
    } catch {
      outputData = { result: toolOutput };
    }
  } else if (typeof toolOutput === 'object' && toolOutput !== null) {
    outputData = toolOutput as Record<string, unknown>;
  }

  if ('error' in outputData) {
    lines.push('');
    lines.push(`### ❌ Error`);
    lines.push('');
    lines.push(`${outputData.error}`);
    lines.push('');
    return lines.join('\n');
  }

  if ('success' in outputData && !outputData.success) {
    lines.push('');
    lines.push(`### ⚠️ Operation Failed`);
    lines.push('');
    if ('message' in outputData) {
      lines.push(`${outputData.message}`);
    }
    lines.push('');
    return lines.join('\n');
  }

  lines.push('');
  lines.push('### ✅ Operation Successful');
  lines.push('');

  if ('message' in outputData && outputData.message) {
    lines.push(`📝 ${outputData.message}`);
    lines.push('');
  }

  if ('signature' in outputData && outputData.signature) {
    const sig = String(outputData.signature);
    lines.push(`🔗 **Transaction ID**: [${sig.slice(0, 8)}...${sig.slice(-8)}](https://explorer.solana.com/tx/${sig}?${clusterParam})`);
    lines.push('');
  }

  if ('workerPda' in outputData && outputData.workerPda) {
    const workerAddr = String(outputData.workerPda);
    lines.push(`👤 **Worker Address**: [${workerAddr.slice(0, 8)}...${workerAddr.slice(-8)}](https://explorer.solana.com/address/${workerAddr}?${clusterParam})`);
    lines.push('');
  }

  if ('orgPda' in outputData && outputData.orgPda) {
    const orgAddr = String(outputData.orgPda);
    lines.push(`🏢 **Organization Address**: [${orgAddr.slice(0, 8)}...${orgAddr.slice(-8)}](https://explorer.solana.com/address/${orgAddr}?${clusterParam})`);
    lines.push('');
  }

  if ('organizations' in outputData && Array.isArray(outputData.organizations)) {
    lines.push('### 📋 Your Organizations');
    lines.push('');
    lines.push('| # | Name | Treasury | Workers | Address |');
    lines.push('|---|------|----------|---------|---------|');
    outputData.organizations.forEach((org: unknown, index: number) => {
      const orgData = org as Record<string, unknown>;
      const name = orgData.name || 'Unknown';
      const treasury = Number(orgData.treasury || 0).toFixed(2);
      const workers = orgData.workersCount || 0;
      const pubKey = orgData.publicKey as string;
      const shortKey = pubKey ? `${String(pubKey).slice(0, 6)}...${String(pubKey).slice(-4)}` : 'N/A';
      const link = pubKey ? `[${shortKey}](https://explorer.solana.com/address/${pubKey}?${clusterParam})` : 'N/A';
      lines.push(`| ${index + 1} | **${name}** | ${treasury} SOL | ${workers} | ${link} |`);
    });
    lines.push('');
  }

  if ('organization' in outputData && typeof outputData.organization === 'object') {
    const org = outputData.organization as Record<string, unknown>;
    lines.push('### 🏢 Organization Details');
    lines.push('');
    lines.push(`| Field | Value |`);
    lines.push(`|-------|-------|`);
    lines.push(`| **Name** | ${org.name || 'Unknown'} |`);
    lines.push(`| **Treasury Balance** | ${Number(org.treasury || 0).toFixed(2)} SOL |`);
    lines.push(`| **Total Workers** | ${org.workersCount || 0} |`);

    if (org.workers && Array.isArray(org.workers) && org.workers.length > 0) {
      lines.push('');
      lines.push('#### 👥 Workers');
      lines.push('');
      lines.push('| # | Address | Salary | Last Paid |');
      lines.push('|---|---------|--------|-----------|');
      org.workers.forEach((worker: unknown, index: number) => {
        const w = worker as Record<string, unknown>;
        const addr = String(w.publicKey || 'N/A');
        const shortAddr = `${addr.slice(0, 6)}...${addr.slice(-4)}`;
        const link = w.publicKey ? `[${shortAddr}](https://explorer.solana.com/address/${addr}?${clusterParam})` : 'N/A';
        const salary = Number(w.salary || 0).toFixed(2);
        const lastPaid = w.lastPaid ? new Date(Number(w.lastPaid) * 1000).toLocaleDateString() : 'Never';
        lines.push(`| ${index + 1} | ${link} | ${salary} SOL | ${lastPaid} |`);
      });
      lines.push('');
    }
  }

  if ('results' in outputData && Array.isArray(outputData.results)) {
    lines.push('### 💰 Payroll Processing Results');
    lines.push('');
    lines.push('| Status | Worker | Message |');
    lines.push('|--------|--------|---------|');
    outputData.results.forEach((result: unknown) => {
      const r = result as Record<string, unknown>;
      const status = r.success ? '✅' : '❌';
      const workerAddr = String(r.workerPublicKey || 'Unknown');
      const shortWorker = `${workerAddr.slice(0, 6)}...${workerAddr.slice(-4)}`;
      const workerLink = r.workerPublicKey ? `[${shortWorker}](https://explorer.solana.com/address/${workerAddr}?${clusterParam})` : 'Unknown';
      lines.push(`| ${status} | ${workerLink} | ${r.message || 'No details'} |`);
    });
    lines.push('');
  }

  const displayedKeys = ['success', 'message', 'signature', 'workerPda', 'orgPda', 'organizations', 'organization', 'results', 'error'];
  const remainingKeys = Object.keys(outputData).filter(key => !displayedKeys.includes(key));

  if (remainingKeys.length > 0) {
    lines.push('### 📊 Additional Details');
    lines.push('');
    lines.push('| Field | Value |');
    lines.push('|-------|-------|');
    remainingKeys.forEach(key => {
      const value = outputData[key];
      if (typeof value === 'object') {
        lines.push(`| **${key}** | \`${JSON.stringify(value)}\` |`);
      } else {
        lines.push(`| **${key}** | ${value} |`);
      }
    });
    lines.push('');
  }

  return lines.join('\n');
};

const Dashboard = () => {
  const [isPayrollOpen, setIsPayrollOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<PayrollSummary[]>([]);
  const [userApiKey, setUserApiKey] = useState<string>('');
  const [apiKeySet, setApiKeySet] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { publicKey, signTransaction } = useWallet();

  const CLUSTER: string = process.env.NEXT_PUBLIC_CLUSTER || 'devnet'

  // Initialize messages with API key requirement check
  useEffect(() => {
    const hasEnvKey = !!process.env.NEXT_PUBLIC_GROQ_API_KEY;
    setApiKeySet(hasEnvKey);

    if (hasEnvKey) {
      setMessages([
        {
          id: 'initial',
          role: 'bot' as const,
          content: 'Hi! I can help manage your payroll organizations. Ask me to create orgs, add workers, process payroll, or fetch details.',
          timestamp: new Date(),
        },
      ]);
    } else {
      setMessages([
        {
          id: 'initial',
          role: 'bot' as const,
          content: 'Welcome! To get started, I need your Groq API key. Please enter it below to enable chat functionality.',
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsPayrollOpen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setWalletContext(publicKey || null, signTransaction || null);
  }, [publicKey, signTransaction]);

  useEffect(() => {
    const loadOrganizations = async () => {
      const tool = blockchainMcpTools.fetch_user_organizations;
      if (!tool || !tool.execute) {
        console.error('fetch_user_organizations tool not available');
        return;
      }

      try {
        const result = await tool.execute!(
          {},
          { toolCallId: 'load-orgs', messages: [] }
        );

        if (typeof result === 'object' && result !== null && 'success' in result) {
          if (result.success && Array.isArray(result.organizations)) {
            const mappedOrgs: PayrollSummary[] = result.organizations.map((org: unknown) => {
              const orgData = org as Record<string, unknown>;
              const workerCount = Number(orgData.workersCount || 0);
              return {
                id: String(orgData.publicKey || orgData.name || ''),
                orgName: String(orgData.name || 'Unknown'),
                treasury: Number(orgData.treasury || 0),
                createdAt: Number(orgData.createdAt || 0),
                workers: Array.from({ length: workerCount }, () => ({}) as WorkerSummary),
              };
            });
            setOrganizations(mappedOrgs);
          }
        }
      } catch (error) {
        console.error('Failed to load organizations:', error);
      }
    };

    if (publicKey) {
      loadOrganizations();
    }
  }, [publicKey]);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userApiKey.trim()) {
      setApiKeySet(true);
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'bot' as const,
        content: 'Great! API key configured. Now I can help manage your payroll organizations. Ask me to create orgs, add workers, process payroll, or fetch details.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }
  };

  const getActiveApiKey = () => {
    return userApiKey || process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
  };

  const generateResponse = async (userInput: string) => {
    setIsLoading(true);

    try {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: userInput,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      const systemPrompt = `You are a helpful payroll management assistant on Solana blockchain. 

Your available organizations:
${organizations.map(org => `- ${org.orgName} (ID: ${org.id})`).join('\n')}

When users ask to:
- "Show organizations" or "list my orgs" → use fetch_user_organizations (no parameters needed)
- "Show details for [ORG_NAME]" → use fetch_organization_details with orgPda from the list above
- "Create organization [NAME]" → use create_organization with the name parameter
- "Add worker" → use add_worker with orgPda, workerPublicKey, and salaryInSol
- "Fund treasury" → use fund_treasury with orgPda and amountInSol
- "Process payroll" → use process_payroll with orgPda
- "Withdraw [AMOUNT] from [ORG_NAME]" → use withdraw_from_treasury with orgPda and amountInSol

CRITICAL FORMATTING RULES:
1. Use Markdown formatting for ALL responses
2. Use ### for section headings (e.g., ### Results, ### Organization Details)
3. Use tables for organized data (organizations list, workers list, payroll results)
4. When displaying transaction signatures or addresses, use clickable Markdown links with Solana Explorer URLs
5. Use bold (**text**) for important values and labels
6. Use bullet points (• or -) for lists
7. Keep responses concise but well-structured
8. The tool results already include nicely formatted tables - include them in your response

Available tools: ${Object.keys(blockchainMcpTools).join(', ')}

SOLANA EXPLORER LINKS:
  When displaying transaction signatures or addresses, ALWAYS provide clickable Solana Explorer links based on the current cluster:
  - Transaction format: https://explorer.solana.com/tx/[SIGNATURE]?cluster=[CLUSTER]
  - Address format: https://explorer.solana.com/address/[ADDRESS]?cluster=[CLUSTER]

  IMPORTANT: Replace [CLUSTER] with the actual cluster value. Always include cluster parameter in links.
  Supported clusters: custom, devnet, testnet, mainnet-beta

  Current cluster: ${getCluster(CLUSTER)}

  Example in response:
  "Transaction: [View on Explorer](https://explorer.solana.com/tx/abc123?cluster=custom)"
  "Organization Address: [ADDRESS](https://explorer.solana.com/address/xyz789?cluster=custom)"`;

      const activeApiKey = getActiveApiKey();
      if (!activeApiKey) {
        throw new Error('API key not configured');
      }

      const provider = createGroq({
        apiKey: activeApiKey,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tools = blockchainMcpTools as any;

      const result = await generateText({
        model: provider(DEFAULT_MODEL) as unknown as Parameters<typeof generateText>[0]['model'],
        system: systemPrompt,
        messages: [...messages, userMessage].map((m) => ({
          role: m.role === 'bot' ? 'assistant' : 'user',
          content: m.content,
        })),
        tools,
        maxSteps: 10,
      });

      let fullResponse = result.text;

      if (result.toolResults && result.toolResults.length > 0) {
        for (const toolResult of result.toolResults) {
          const toolName = toolResult.toolName;
          const toolArgs = toolResult.args as Record<string, unknown>;
          const resultValue = toolResult.result;
          
          if (toolName && resultValue !== undefined) {
            const formattedOutput = formatToolResponse(
              toolName,
              toolArgs,
              resultValue,
              getCluster(CLUSTER)
            );
            fullResponse += '\n' + formattedOutput;
          }
        }
      }

      if (!fullResponse.trim()) {
        fullResponse = 'I received your message but couldn\'t generate a response. Please try again.';
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot' as const,
        content: fullResponse.trim(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      if (publicKey) {
        const tool = blockchainMcpTools.fetch_user_organizations;
        const result = await tool.execute!({}, { toolCallId: 'refresh', messages: [] });
        if (result && typeof result === 'object' && 'success' in result && result.success) {
          const mappedOrgs: PayrollSummary[] = (result.organizations as unknown[]).map((org: unknown) => {
            const orgData = org as Record<string, unknown>;
            const workerCount = Number(orgData.workersCount || 0);
            return {
              id: String(orgData.publicKey || orgData.name || ''),
              orgName: String(orgData.name || 'Unknown'),
              treasury: Number(orgData.treasury || 0),
              workers: Array.from({ length: workerCount }, () => ({}) as WorkerSummary),
              createdAt: Number(orgData.createdAt || 0),
            };
          });
          setOrganizations(mappedOrgs);
        }
      }

    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'bot' as const,
        content: `Sorry, something went wrong: ${(error as Error).message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim()) {
      generateResponse(input);
      setInput('');
    }
  };

  const formatLamports = (lamports: number) => {
    return lamports.toFixed(2) + ' SOL';
  };

  const handleViewDetails = (orgName: string) => {
    generateResponse(`Show details for organization ${orgName}`);
  };

  const handleTogglePanel = () => {
    setIsPayrollOpen(!isPayrollOpen);
  };

  return (
    <div className="min-h-screen bg-[#0a0512] pt-16 sm:pt-20">
      <Header />

      {!publicKey && (
        <div className="fixed top-16 sm:top-20 right-2 sm:right-4 z-40 p-3 sm:p-4 bg-white/5 border border-white/10 text-white/70 rounded-lg text-xs sm:text-sm max-w-[90vw] sm:max-w-none backdrop-blur-sm">
          <p>Connect your wallet to enable transactions.</p>
        </div>
      )}

      <main className="max-w-[95vw] lg:max-w-[75vw] mx-auto px-3 sm:px-6 pb-6 mt-4 sm:mt-8">
        <div className="max-w-full min-h-[calc(100vh-35rem)] flex flex-col lg:flex-row gap-4 sm:gap-6">
          <ChatPanel
            messages={messages}
            input={input}
            isLoading={isLoading || !apiKeySet}
            isPayrollOpen={isPayrollOpen}
            publicKey={publicKey}
            onInputChange={setInput}
            onSubmit={handleSubmit}
            apiKeySet={apiKeySet}
            userApiKey={userApiKey}
            onApiKeyChange={setUserApiKey}
            onApiKeySubmit={handleApiKeySubmit}
          />

          <OrganizationsPanel
            organizations={organizations}
            selectedOrg={selectedOrg}
            isOpen={isPayrollOpen}
            onToggle={handleTogglePanel}
            onSelectOrg={setSelectedOrg}
            onViewDetails={handleViewDetails}
            formatLamports={formatLamports}
          />

          {!isPayrollOpen && (
            <button
              onClick={handleTogglePanel}
              className="fixed right-4 sm:right-6 bottom-20 sm:bottom-auto sm:top-32 p-3 bg-white text-black rounded-xl shadow-lg transition-all duration-200 z-40"
              aria-label="Open organizations panel"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;