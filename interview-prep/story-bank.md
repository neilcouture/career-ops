# Story Bank — Master STAR+R Stories

This file accumulates your best interview stories over time. Each evaluation (Block F) adds new stories here. Instead of memorizing 100 answers, maintain 5-10 deep stories that you can bend to answer almost any behavioral question.

## How it works

1. Every time `/career-ops oferta` generates Block F (Interview Plan), new STAR+R stories get appended here
2. Before your next interview, review this file — your stories are already organized by theme
3. The "Big Three" questions can be answered with stories from this bank:
   - "Tell me about yourself" → combine 2-3 stories into a narrative
   - "Tell me about your most impactful project" → pick your highest-impact story
   - "Tell me about a conflict you resolved" → find a story with a Reflection

## Stories

### [AI Deployment] Hermes LLM Client AI Adoption Framework
**Source:** Report #006 — Intercom — Senior AI Deployment Architect
**S (Situation):** Consulting client struggling to adopt LLMs in their engineering workflow, no existing AI tooling or governance.
**T (Task):** Design and deliver an end-to-end AI adoption framework that the client's team could sustain independently.
**A (Action):** Created MCP-based tooling architecture, established AI governance guidelines, ran hands-on training sessions with the engineering team.
**R (Result):** Client team transitioned to AI-augmented development with measurable productivity gains.
**Reflection:** The playbook matters more than the technology — repeatable frameworks scale, one-off implementations don't.
**Best for questions about:** deployment methodology, customer-facing delivery, AI adoption, change management

### [Change Management] AI-First Workflow Transition at SymetryML
**Source:** Report #006 — Intercom — Senior AI Deployment Architect
**S (Situation):** Engineering team at SymetryML working with traditional development methods, no AI integration in daily workflows.
**T (Task):** Transition the entire team to an AI-augmented development workflow without disrupting delivery.
**A (Action):** Wrote AI usage guidelines from scratch, integrated Claude Code and MCP into daily workflow, established testing strategies for AI-generated code.
**R (Result):** Team adopted AI-first development; guidelines became the company standard governing all LLM usage.
**Reflection:** Change management requires both top-down mandate and bottom-up tooling — you need both or neither sticks.
**Best for questions about:** organizational change, leading transformation, team adoption, governance

### [Cross-Functional] Patent & Architecture Reviews at AdTheorent
**Source:** Report #006 — Intercom — Senior AI Deployment Architect
**S (Situation):** Post-acquisition integration at AdTheorent with competing priorities across engineering, product, and business teams.
**T (Task):** Align all stakeholders on platform evolution direction while protecting IP.
**A (Action):** Led architecture reviews, coordinated IP protection efforts resulting in patent filings, managed cross-team dependencies.
**R (Result):** Successful integration, patent filed, platform evolved for production-scale inference in programmatic advertising.
**Reflection:** In cross-functional work, written artifacts (architecture docs, decision records) prevent 80% of miscommunication.
**Best for questions about:** cross-functional collaboration, stakeholder management, post-acquisition integration, conflict resolution

### [Building with AI] career-ops: Full Pipeline on Claude Code
**Source:** Report #005 — Anthropic — Forward Deployed Engineer, Applied AI
**S (Situation):** Needed a job search system that could evaluate 100+ offers with consistent quality.
**T (Task):** Build end-to-end pipeline: evaluation, CV generation, portal scanning, batch processing — all on Claude Code + MCP.
**A (Action):** Designed the architecture: modes for each workflow, MCP integration, Playwright for scraping, Node.js for automation. Built it solo using Claude Code as the primary development tool.
**R (Result):** Working system that evaluated 740+ offers, generated 100+ tailored CVs, tracked entire pipeline. Open-sourced the framework.
**Reflection:** Building WITH Claude rather than just using Claude's API taught me what enterprise customers will struggle with — context management, tool reliability, error recovery.
**Best for questions about:** production LLM systems, building with AI, MCP integration, end-to-end delivery, technical depth

### [Enterprise Sales] SymetryML: Spin-out to PMF
**Source:** Report #005 — Anthropic — Forward Deployed Engineer, Applied AI
**S (Situation):** SymetryML spun off from AdTheorent and needed to find product-market fit in healthcare.
**T (Task):** Take a research platform and turn it into an enterprise product with paying customers.
**A (Action):** Built the entire technical stack (Python, C++, CUDA, Java), designed REST APIs for real-time model serving, personally led customer deployments in healthcare.
**R (Result):** Took company from spin-out to product-market fit with enterprise healthcare clients.
**Reflection:** Enterprise customers don't buy technology — they buy confidence. The federated learning was novel, but what closed deals was showing them their data never left their environment.
**Best for questions about:** enterprise sales, product-market fit, startup to scale, customer trust, healthcare AI

### [Ambiguity] Real Time Data Solution: First Employee to CTO
**Source:** Report #005 — Anthropic — Forward Deployed Engineer, Applied AI
**S (Situation):** Joined as employee #1 of a big data startup with zero existing infrastructure.
**T (Task):** Build the company's entire technical stack and team from scratch.
**A (Action):** Owned architecture across Java, C/C++, CUDA, REST, Spark, Hadoop. Hired and managed dev + data science teams. Served as primary technical contact for all customers.
**R (Result):** Built vertical solutions in finance and medical imaging, handled AWS deployment, grew the technical organization.
**Reflection:** The ambiguity of being employee #1 is that everything is your job. Learned to ruthlessly prioritize: ship the thing that proves the business model first, optimize later.
**Best for questions about:** ambiguity, high agency, startup, building from zero, prioritization

### [Enterprise AI Deployment] SymetryML: Healthcare Client Trust
**Source:** Report #009 — Parloa — Lead AI Agent Architect
**S (Situation):** Enterprise healthcare clients needed privacy-preserving ML but had zero AI infrastructure and deep skepticism about data leaving their environment.
**T (Task):** Design and deploy a federated learning platform that clients could trust with patient data.
**A (Action):** Built the DEM platform with SMPC layer ensuring raw data never leaves the client environment. Personally led customer deployments, serving as the trusted technical advisor throughout.
**R (Result):** Clients adopted the platform; the "your data never leaves" guarantee was the key trust factor that closed enterprise deals.
**Reflection:** Enterprise AI adoption is about confidence, not technology. Show them their data is safe and the rest follows.
**Best for questions about:** enterprise customer trust, complex deployments, privacy-preserving AI, customer-facing technical advisory

### [Agent Architecture] career-ops: Structured Agent Workflows with Guardrails
**Source:** Report #009 — Parloa — Lead AI Agent Architect
**S (Situation):** Needed a multi-mode AI agent system to evaluate 740+ job offers with consistent quality, structured outputs, and error recovery.
**T (Task):** Design agent architecture with prompt engineering, structured workflows, and quality guardrails at every step.
**A (Action):** Built mode-based agent system where each mode (evaluation, scanning, PDF generation) is a structured workflow with chain-of-thought prompting, few-shot examples, and continuous iteration loops.
**R (Result):** System processed 740+ offers, generated 100+ tailored outputs, maintained quality at scale with measurable consistency.
**Reflection:** Agent reliability requires guardrails at every step — structured workflows with explicit checkpoints beat free-form reasoning every time.
**Best for questions about:** AI agent design, guardrails, prompt engineering at scale, structured workflows, quality assurance for AI systems

### [Security Architecture] SMPC & Federated Learning at SymetryML
**Source:** Report #007 — Glean — Partner Solutions Architect (Innovation Lab)
**S (Situation):** Healthcare clients required privacy guarantees — raw data too sensitive to centralize.
**T (Task):** Design ML platform where data never leaves client environment.
**A (Action):** Implemented Secure Multi-Party Computation layer for federated learning, ensuring privacy guarantees at the architecture level.
**R (Result):** Production federated learning system serving enterprise healthcare clients; security architecture became primary competitive differentiator.
**Reflection:** Security can't be bolted on — it has to be foundational. The SMPC decision shaped every subsequent architecture choice. Same principle for designing partner-ready solutions.
**Best for questions about:** security architecture, privacy-preserving ML, foundational design decisions, enterprise trust

### [Multi-Cloud] Automated Multi-Cloud Deployment at SymetryML
**Source:** Report #007 — Glean — Partner Solutions Architect (Innovation Lab)
**S (Situation):** Platform needed to run across AWS, OCI, Azure, and Databricks for different enterprise clients.
**T (Task):** Automate and standardize deployment across multiple clouds.
**A (Action):** Built deployment pipelines for multi-cloud using Docker and cloud-native tooling, standardized configuration across environments.
**R (Result):** Platform deployable to any of 4 cloud targets with consistent behavior.
**Reflection:** Multi-cloud taught me that abstraction layers matter — the same solution pattern needs to work regardless of underlying infrastructure. Core to building reusable partner templates.
**Best for questions about:** multi-cloud, deployment automation, infrastructure patterns, reusable architectures

### [Real-Time Systems] RTDS: Building Real-Time Analytics Infrastructure from Zero
**Source:** Report #041 — LiveKit — Forward Deployed Engineer
**S (Situation):** Joined as employee #1 at a real-time data analytics startup with no existing infrastructure.
**T (Task):** Build the company's entire real-time processing stack from scratch.
**A (Action):** Designed and built architecture across Java, C/C++, CUDA, REST, Spark, Hadoop, Redis. Optimized for low-latency real-time analytics at scale.
**R (Result):** Production real-time analytics platform serving finance and medical imaging verticals on AWS.
**Reflection:** Real-time systems demand different design principles — you optimize for latency first, throughput second. Every architectural decision has to account for the speed-of-light constraint.
**Best for questions about:** real-time systems, building from zero, infrastructure design, startup ambiguity, latency optimization

### [Developer Platform] Hermes LLM: MCP-Based Developer Tooling Architecture
**Source:** Report #041 — LiveKit — Forward Deployed Engineer
**S (Situation):** Organizations struggling to adopt LLMs in engineering workflows — no existing tooling, no governance, no patterns.
**T (Task):** Design developer tooling that integrates AI reasoning directly into coding workflows while preserving security and control.
**A (Action):** Created MCP-based tooling architecture with controlled tool surfaces and access control. Established governance guidelines. Delivered hands-on training and architecture sessions.
**R (Result):** Client teams transitioned to AI-augmented development with measurable productivity gains. Onboarding time reduced from 2 weeks to 3 days per new client.
**Reflection:** Developer platforms succeed when they meet developers where they are — not when they force new workflows. The MCP layer was the bridge.
**Best for questions about:** developer platforms, AI tooling design, MCP integration, customer enablement, technical workshops

### [Production Debugging] LLM Reliability in Clinical Pipelines at SymetryML
**Source:** Report #041 — LiveKit — Forward Deployed Engineer
**S (Situation):** Enterprise healthcare clients needed LLMs (Claude, ChatGPT, Mistral) in clinical analytics pipelines but couldn't tolerate non-deterministic failures.
**T (Task):** Make LLMs reliable at scale in healthcare — cost controls, error handling, deterministic outputs.
**A (Action):** Built error handling with deterministic fallback paths, cost monitoring via OpenTelemetry, model-selection routing. Established testing strategies for AI-generated outputs.
**R (Result):** LLMs running reliably in production clinical analytics with zero critical failures in first 6 months post-launch.
**Reflection:** LLM reliability is an engineering problem, not a model problem. The infrastructure around the model matters more than the model itself.
**Best for questions about:** debugging production issues, LLM reliability, enterprise AI, error handling at scale, monitoring

### [Pre-Sales / Technical Evaluation] Hermes LLM Client Discovery-to-PoC Cycle
**Source:** Report #047 — n8n — Senior Solutions Engineer
**S (Situation):** Consulting client evaluating AI tools with no framework for decision-making and no existing AI governance.
**T (Task):** Lead technical discovery, architect a solution, deliver a working PoC that the client's team could evaluate independently.
**A (Action):** Conducted discovery sessions with engineering leadership, mapped workflows to AI automation opportunities, built custom MCP-based PoC, presented ROI framing.
**R (Result):** Client adopted AI-augmented development with measurable productivity gains and a clear implementation roadmap.
**Reflection:** Technical pre-sales is about reducing the customer's uncertainty — show them their specific problem solved, not a generic demo. The best PoC is the one they can run themselves after you leave.
**Best for questions about:** technical pre-sales, customer discovery, PoC delivery, evaluation leadership, solution architecture

### [Workflow Orchestration] career-ops as Production Automation System
**Source:** Report #047 — n8n — Senior Solutions Engineer
**S (Situation):** Needed to evaluate 740+ job offers with consistent quality, structured outputs, and pipeline tracking across multiple modes.
**T (Task):** Build a multi-mode workflow automation system: evaluation, scanning, PDF generation, batch processing, all orchestrated through Claude Code + MCP.
**A (Action):** Designed mode-based architecture where each workflow step has structured inputs/outputs, error recovery, and quality guardrails. Integrated MCP tools, Playwright for scraping, Node.js for automation.
**R (Result):** Working system processing hundreds of evaluations with measurable consistency. Open-sourced the framework.
**Reflection:** career-ops is essentially a workflow orchestration system — modes are workflows, MCP tools are integrations, guardrails are quality checks. Understanding orchestration at this level transfers directly to platform products like n8n.
**Best for questions about:** workflow orchestration, automation design, AI-powered workflows, production systems, open source

### [0-to-1 Product] SymetryML Discovery to PMF
**Source:** Report #048 — Glean — Forward Deployed Product Manager
**S (Situation):** SymetryML spun off from AdTheorent with ML technology but no clear product-market fit and no customers in the target vertical.
**T (Task):** Identify the right vertical, build the right product, close the first enterprise customers — all simultaneously.
**A (Action):** Talked to 20+ potential customers across verticals. Identified healthcare as the highest-value fit because of privacy constraints that our federated learning uniquely solved. Designed architecture around SMPC, built REST APIs for model serving, led customer deployments personally.
**R (Result):** Enterprise healthcare clients signed; company reached product-market fit. The privacy guarantee became the primary selling point.
**Reflection:** The 0-to-1 discovery is the hardest part. You need to talk to enough customers to see the pattern, then build the smallest thing that tests the hypothesis. At SymetryML, the insight was that healthcare clients didn't care about ML accuracy — they cared that data never left their environment.
**Best for questions about:** 0-to-1 product building, product discovery, product-market fit, enterprise sales, founder experience

### [Playbook Creation] AI Adoption Framework to Company Standard
**Source:** Report #048 — Glean — Forward Deployed Product Manager
**S (Situation):** SymetryML engineering team had individually adopted AI tools but with no consistent approach, creating quality and security risks.
**T (Task):** Convert ad-hoc AI tool usage into a repeatable, scalable framework the entire organization could follow.
**A (Action):** Wrote AI usage guidelines from scratch, built testing strategies for AI-generated code, integrated Claude Code and MCP into the workflow, documented best practices as a formal playbook.
**R (Result):** Guidelines became the company standard governing all LLM usage. Framework scaled from one team to the entire engineering organization.
**Reflection:** The playbook IS the product. If it works for one team but can't be repeated, it's not a solution — it's a workaround. FDPM success is measured by how many customers can replicate the pattern.
**Best for questions about:** playbook creation, scaling initiatives, standardization, AI governance, converting experiments to repeatable processes

### [GPU Infrastructure] Production GPU-Accelerated ML at AdTheorent
**Source:** Report #034 — Mistral AI — Infrastructure Solution Architect, EMEA
**S (Situation):** At AdTheorent, ML models needed GPU acceleration for programmatic advertising's real-time bidding (sub-100ms latency).
**T (Task):** Build GPU-accelerated inference pipeline that met production SLAs.
**A (Action):** Implemented CUDA-based inference, built monitoring for GPU utilization and memory patterns, identified and resolved thermal throttling under sustained load, implemented workload scheduling.
**R (Result):** Production-scale GPU inference running reliably under latency constraints with proactive monitoring.
**Reflection:** GPU infrastructure is only as good as its monitoring — you need to know when it's degrading before your customers do. The troubleshooting investment that pays off most is monitoring you set up before the incident.
**Best for questions about:** GPU infrastructure, production debugging, performance optimization, monitoring, low-latency systems

### [Enterprise Integration] Recommender Systems for Macy's and AmEx at Objectifi
**Source:** Report #032 — ElevenLabs — Enterprise Solutions Engineer
**S (Situation):** Macy's needed a personalized recommendation engine integrated into their existing e-commerce stack.
**T (Task):** Design a scalable recommender system that fit their infrastructure constraints.
**A (Action):** Designed API layer, data pipeline, and model serving architecture. Integrated into existing systems without disrupting operations.
**R (Result):** Delivered working recommender for Macy's and AmEx with real-time personalization.
**Reflection:** Enterprise integrations succeed when you design for their constraints, not your ideal architecture. The customer's infrastructure is a feature, not a bug.
**Best for questions about:** enterprise integration, solution architecture, API design, working with customer constraints

### [Building Functions from Zero] RTDS First Hire to CTO
**Source:** Report #035 — LangChain — Partner Engineer
**S (Situation):** Joined as employee #1 of a big data startup — no team, no product, no processes, no customers.
**T (Task):** Build everything: architecture, team, customer relationships, delivery process.
**A (Action):** Hired and managed developers and data scientists, owned full-stack architecture (Java, C/C++, CUDA, REST, Spark, Hadoop), served as primary customer contact for all verticals.
**R (Result):** Built the company from zero to product-market fit with enterprise clients in finance and medical imaging.
**Reflection:** Building from zero requires prioritizing ruthlessly — the first partner program / team / product should serve the top 3 stakeholders well, not the top 30 poorly.
**Best for questions about:** building from zero, founding a function, startup ambiguity, prioritization, first hire experience

### [RLHF-Adjacent] LLM Model Selection Routing at SymetryML
**Source:** Report #051 — Adaptive ML — Solutions Engineer
**S (Situation):** Enterprise healthcare clients needed multiple LLMs (Claude, ChatGPT, Mistral) in clinical analytics pipelines with different accuracy/cost profiles and strict reliability SLAs.
**T (Task):** Build a routing layer that matched query type to the most cost-effective capable model while maintaining deterministic, auditable outputs.
**A (Action):** Built model-selection routing with query classification, OpenTelemetry cost monitoring, and deterministic fallback paths for non-deterministic LLM outputs.
**R (Result):** Cost per inference 40% below initial estimates; zero critical failures in first 6 months post-launch.
**Reflection:** Model selection is the first layer of "making AI adaptive" — intelligent routing reduces cost and improves reliability before you ever need fine-tuning. Understanding this lets me speak credibly about what RLHF and post-training add on top of routing optimization.
**Best for:** RLHF platform discussions, LLM cost optimization, enterprise AI deployment, model evaluation and routing

### [Multi-GPU Production] LLM Clinical Pipelines at SymetryML
**Source:** Report #049 — Nebius — AI/ML Specialist Solutions Architect
**S (Situation):** Enterprise healthcare clients needed LLMs (Claude, ChatGPT, Mistral) embedded in clinical analytics pipelines running on GPU-accelerated infrastructure with strict latency and cost SLAs.
**T (Task):** Design a production LLM serving layer that was reliable, cost-controlled, and auditable in a regulated environment.
**A (Action):** Built model-selection routing (matching query type to cheapest capable model), cost monitoring via OpenTelemetry, deterministic fallback paths for non-deterministic LLM outputs, and testing strategies for AI-generated clinical recommendations.
**R (Result):** Zero critical failures in first 6 months post-launch. Cost per inference 40% below initial estimates due to routing optimization.
**Reflection:** Production LLM deployment is an infrastructure problem, not a model problem. The model is the easy part — the routing, fallbacks, monitoring, and cost controls are what make it enterprise-grade.
**Best for questions about:** GPU-scale AI deployments, LLM reliability, multi-model inference routing, enterprise AI infrastructure, production ML serving

### [Distributed Team Leadership] SymetryML: Managing Across Time Zones as CTO
**Source:** Report #052 — Canonical — Engineering Manager, MLOps & Analytics
**S (Situation):** SymetryML had a fully distributed engineering team spanning multiple time zones with no formal EM infrastructure.
**T (Task):** Keep the team productive, aligned, and unblocked while also serving as the hands-on technical lead.
**A (Action):** Established regular 1:1 cadences, created asynchronous decision records, built testing standards as team documentation, and held architecture reviews to keep engineers unblocked without requiring synchronous availability.
**R (Result):** Team delivered multi-cloud ML platform across 4 cloud targets with zero critical production incidents in first 6 months post-launch.
**Reflection:** The most important EM skill is reducing friction — a good async culture matters more than meeting frequency.
**Best for questions about:** distributed team management, async leadership, EM fundamentals, remote team health
