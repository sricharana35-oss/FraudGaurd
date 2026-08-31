<script>
    import { onMount } from "svelte";

    // Render backend URL
    const API_URL = "https://fraudgaurd-5.onrender.com";

    let name = "";
    let email = "";
    let deviceId = "";

    let result = null;
    let error = "";
    let submitting = false;

    let stats = {
        total: 0,
        low: 0,
        medium: 0,
        high: 0
    };

    let users = [];

    async function loadDashboard() {
        try {
            const statsResponse = await fetch(
                `${API_URL}/api/admin/stats`
            );

            const statsData = await statsResponse.json();

            if (statsData.success) {
                stats = statsData.stats;
            }

            const usersResponse = await fetch(
                `${API_URL}/api/admin/users`
            );

            const usersData = await usersResponse.json();

            if (usersData.success) {
                users = usersData.users;
            }
        } catch (err) {
            console.error("Dashboard error:", err);
        }
    }

    async function signup() {
        error = "";
        result = null;

        if (!name.trim() || !email.trim()) {
            error = "Name and email are required.";
            return;
        }

        submitting = true;

        try {
            const response = await fetch(
                `${API_URL}/api/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        deviceId
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                error = data.message || "Signup failed.";
                return;
            }

            result = data.fraudDetection;

            name = "";
            email = "";
            deviceId = "";

            await loadDashboard();

        } catch (err) {
            console.error("Signup error:", err);
            error = "Unable to connect to the backend server.";
        } finally {
            submitting = false;
        }
    }

    onMount(loadDashboard);
</script>

<svelte:head>
    <title>Multi-Account Fraud Detection</title>

    <meta
        name="description"
        content="Multi-Account Abuse Detection and Fraudulent Signup Prevention System"
    />
</svelte:head>

<div class="app">

    <!-- HEADER -->

    <header class="header">

        <div class="brand">

            <div class="logo">F</div>

            <div>
                <h1>FraudGuard</h1>
                <p>Multi-Account Abuse Detection</p>
            </div>

        </div>

        <div class="system-status">
            <span></span>
            System Online
        </div>

    </header>


    <!-- HERO -->

    <section class="hero">

        <div class="hero-inner">

            <div class="hero-label">
                FRAUD PREVENTION PLATFORM
            </div>

            <h2>
                Detect suspicious
                <span>multi-account</span>
                activity.
            </h2>

            <p>
                Analyze signup signals and identify potentially abusive
                accounts before free credits or trial benefits are
                repeatedly claimed.
            </p>

        </div>

    </section>


    <!-- SIGNUP -->

    <main>

        <section class="section">

            <div class="section-title">

                <div>
                    <div class="label">LIVE DETECTION</div>

                    <h2>Analyze a New Signup</h2>

                    <p>
                        Enter account information to evaluate its fraud risk.
                    </p>
                </div>

            </div>


            <div class="signup-grid">

                <!-- FORM -->

                <div class="card form-card">

                    <h3>Signup Information</h3>

                    <p class="card-description">
                        Provide the details collected during registration.
                    </p>


                    <label>
                        Full Name

                        <input
                            type="text"
                            bind:value={name}
                            placeholder="Enter full name"
                        />
                    </label>


                    <label>
                        Email Address

                        <input
                            type="email"
                            bind:value={email}
                            placeholder="Enter email address"
                        />
                    </label>


                    <label>
                        Device ID

                        <input
                            type="text"
                            bind:value={deviceId}
                            placeholder="Enter device identifier"
                        />
                    </label>


                    <button
                        class="primary-button"
                        onclick={signup}
                        disabled={submitting}
                    >
                        {submitting
                            ? "Analyzing..."
                            : "Analyze Signup"}
                    </button>


                    {#if error}

                        <div class="error-box">
                            {error}
                        </div>

                    {/if}

                </div>


                <!-- RESULT -->

                {#if result}

                    <div class="card result-card">

                        <div class="result-top">

                            <div>
                                <div class="label">ANALYSIS COMPLETE</div>

                                <h3>Fraud Detection Result</h3>
                            </div>

                            <div class="score">
                                {result.riskScore}
                                <small>/100</small>
                            </div>

                        </div>


                        <div class="result-grid">

                            <div class="result-box">

                                <span>Risk Level</span>

                                <strong
                                    class:low-text={result.riskLevel === "LOW"}
                                    class:medium-text={result.riskLevel === "MEDIUM"}
                                    class:high-text={result.riskLevel === "HIGH"}
                                >
                                    {result.riskLevel}
                                </strong>

                            </div>


                            <div class="result-box">

                                <span>Recommended Action</span>

                                <strong>
                                    {result.action}
                                </strong>

                            </div>

                        </div>


                        <div class="reasons">

                            <h4>Detection Signals</h4>

                            {#if result.reasons?.length}

                                {#each result.reasons as reason}

                                    <div class="reason">
                                        <span>!</span>
                                        {reason}
                                    </div>

                                {/each}

                            {:else}

                                <div class="safe">
                                    No suspicious signals detected.
                                </div>

                            {/if}

                        </div>

                    </div>

                {:else}

                    <div class="card waiting-card">

                        <div class="waiting-icon">—</div>

                        <h3>Awaiting Analysis</h3>

                        <p>
                            Submit a signup to see the fraud detection
                            result here.
                        </p>

                    </div>

                {/if}

            </div>

        </section>


        <!-- DASHBOARD -->

        <section class="dashboard">

            <div class="section dashboard-title">

                <div>

                    <div class="label">ADMIN DASHBOARD</div>

                    <h2>Signup Risk Overview</h2>

                    <p>
                        Monitor registered accounts and their detected risk.
                    </p>

                </div>


                <button
                    class="refresh-button"
                    onclick={loadDashboard}
                >
                    Refresh
                </button>

            </div>


            <!-- STATISTICS -->

            <div class="stats">

                <div class="stat">

                    <span>Total Accounts</span>

                    <strong>
                        {stats.total}
                    </strong>

                </div>


                <div class="stat low-stat">

                    <span>Low Risk</span>

                    <strong>
                        {stats.low}
                    </strong>

                </div>


                <div class="stat medium-stat">

                    <span>Medium Risk</span>

                    <strong>
                        {stats.medium}
                    </strong>

                </div>


                <div class="stat high-stat">

                    <span>High Risk</span>

                    <strong>
                        {stats.high}
                    </strong>

                </div>

            </div>


            <!-- TABLE -->

            <div class="card table-card">

                <div class="table-header">

                    <div>
                        <h3>Registered Accounts</h3>

                        <p>
                            {users.length} account(s) in the system
                        </p>
                    </div>

                </div>


                {#if users.length === 0}

                    <div class="no-users">
                        No accounts have been registered yet.
                    </div>

                {:else}

                    <div class="table-wrapper">

                        <table>

                            <thead>

                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Device</th>
                                    <th>Risk Score</th>
                                    <th>Risk Level</th>
                                    <th>Action</th>
                                </tr>

                            </thead>


                            <tbody>

                                {#each users as user}

                                    <tr>

                                        <td>
                                            {user.name}
                                        </td>

                                        <td>
                                            {user.email}
                                        </td>

                                        <td>
                                            {user.deviceId || "Not provided"}
                                        </td>

                                        <td>
                                            <strong>
                                                {user.riskScore ?? 0}
                                            </strong>
                                        </td>

                                        <td>

                                            <span
                                                class="badge"
                                                class:badge-low={user.riskLevel === "LOW"}
                                                class:badge-medium={user.riskLevel === "MEDIUM"}
                                                class:badge-high={user.riskLevel === "HIGH"}
                                            >
                                                {user.riskLevel}
                                            </span>

                                        </td>

                                        <td>

                                            <span class="action">
                                                {user.action}
                                            </span>

                                        </td>

                                    </tr>

                                {/each}

                            </tbody>

                        </table>

                    </div>

                {/if}

            </div>

        </section>


        <!-- HOW IT WORKS -->

        <section class="section how">

            <div class="section-title centered">

                <div class="label">
                    DETECTION PROCESS
                </div>

                <h2>How the System Works</h2>

                <p>
                    The platform evaluates signup signals against
                    previously registered accounts.
                </p>

            </div>


            <div class="steps">

                <div class="step">

                    <span>01</span>

                    <h3>Collect Signals</h3>

                    <p>
                        Collect IP address, device identifier and
                        browser information during signup.
                    </p>

                </div>


                <div class="step">

                    <span>02</span>

                    <h3>Compare Data</h3>

                    <p>
                        Compare the new signup against existing
                        accounts stored in the database.
                    </p>

                </div>


                <div class="step">

                    <span>03</span>

                    <h3>Calculate Risk</h3>

                    <p>
                        Matching signals contribute points to the
                        account's overall risk score.
                    </p>

                </div>


                <div class="step">

                    <span>04</span>

                    <h3>Take Action</h3>

                    <p>
                        Classify the signup and recommend whether
                        to allow, review or limit it.
                    </p>

                </div>

            </div>


            <!-- RISK LEVELS -->

            <div class="risk-info">

                <h3>Risk Classification</h3>

                <div class="risk-levels">

                    <div>
                        <strong class="low-text">
                            LOW
                        </strong>

                        <span>0 – 29</span>

                        <small>ALLOW</small>
                    </div>


                    <div>
                        <strong class="medium-text">
                            MEDIUM
                        </strong>

                        <span>30 – 59</span>

                        <small>REVIEW</small>
                    </div>


                    <div>
                        <strong class="high-text">
                            HIGH
                        </strong>

                        <span>60 – 100</span>

                        <small>LIMIT</small>
                    </div>

                </div>

            </div>

        </section>

    </main>


    <!-- FOOTER -->

    <footer>

        <strong>FraudGuard</strong>

        <span>
            Multi-Account Abuse Detection & Fraudulent Signup Prevention System
        </span>

    </footer>

</div>


<style>

    :global(*) {
        box-sizing: border-box;
    }

    :global(body) {
        margin: 0;
        background: #f4f6f9;
        color: #172033;
        font-family:
            Arial,
            Helvetica,
            sans-serif;
    }

    :global(button),
    :global(input) {
        font-family: inherit;
    }


    /* HEADER */

    .header {
        height: 74px;
        padding: 0 7%;
        background: #ffffff;
        border-bottom: 1px solid #dfe3ea;

        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .brand {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .logo {
        width: 40px;
        height: 40px;
        background: #172033;
        color: #ffffff;
        border-radius: 9px;

        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 20px;
        font-weight: 800;
    }

    .brand h1 {
        margin: 0;
        font-size: 18px;
        color: #172033;
    }

    .brand p {
        margin: 2px 0 0;
        font-size: 11px;
        color: #657083;
    }

    .system-status {
        color: #3f4b5f;
        font-size: 13px;

        display: flex;
        align-items: center;
        gap: 8px;
    }

    .system-status span {
        width: 8px;
        height: 8px;
        background: #1b9b52;
        border-radius: 50%;
    }


    /* HERO */

    .hero {
        background: #172033;
        color: #ffffff;
        padding: 78px 7%;
    }

    .hero-inner {
        max-width: 850px;
    }

    .hero-label,
    .label {
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 1.5px;
    }

    .hero-label {
        color: #b7c0d1;
        margin-bottom: 16px;
    }

    .hero h2 {
        margin: 0;
        font-size: clamp(38px, 5vw, 62px);
        line-height: 1.05;
        color: #ffffff;
    }

    .hero h2 span {
        color: #aab5ff;
    }

    .hero p {
        max-width: 720px;
        margin-top: 22px;

        color: #d3d8e3;
        line-height: 1.7;
        font-size: 16px;
    }


    /* SECTIONS */

    .section {
        padding: 65px 7%;
    }

    .section-title {
        margin-bottom: 30px;
    }

    .section-title h2,
    .dashboard-title h2 {
        margin: 8px 0;
        color: #172033;
        font-size: 30px;
    }

    .section-title p,
    .dashboard-title p {
        margin: 0;
        color: #5e697b;
    }

    .label {
        color: #5364c7;
    }


    /* CARDS */

    .card {
        background: #ffffff;
        border: 1px solid #dfe3ea;
        border-radius: 14px;
        box-shadow: 0 4px 14px rgba(20, 30, 50, 0.05);
    }


    /* SIGNUP */

    .signup-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
    }

    .form-card {
        padding: 30px;
    }

    .form-card h3,
    .result-card h3,
    .waiting-card h3 {
        margin: 0;
        color: #172033;
        font-size: 21px;
    }

    .card-description {
        color: #647084;
        font-size: 13px;
        margin-bottom: 28px;
    }

    label {
        display: block;
        color: #344054;
        font-size: 13px;
        font-weight: 700;
        margin-bottom: 18px;
    }

    input {
        width: 100%;
        margin-top: 8px;
        padding: 13px 14px;

        border: 1px solid #cdd3dc;
        border-radius: 8px;

        background: #ffffff;
        color: #172033;

        font-size: 14px;
        outline: none;
    }

    input::placeholder {
        color: #8993a3;
    }

    input:focus {
        border-color: #5364c7;
        box-shadow: 0 0 0 3px rgba(83, 100, 199, 0.12);
    }

    .primary-button {
        width: 100%;
        padding: 14px;

        border: none;
        border-radius: 8px;

        background: #5364c7;
        color: #ffffff;

        font-size: 14px;
        font-weight: 700;

        cursor: pointer;
    }

    .primary-button:hover {
        background: #4354b4;
    }

    .primary-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .error-box {
        margin-top: 15px;
        padding: 12px;

        border-radius: 8px;

        background: #fff0f0;
        border: 1px solid #f2c7c7;
        color: #9f2525;

        font-size: 13px;
    }


    /* RESULT */

    .result-card {
        padding: 30px;
        border-top: 4px solid #5364c7;
    }

    .result-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .score {
        color: #172033;
        font-size: 43px;
        font-weight: 800;
    }

    .score small {
        color: #707b8d;
        font-size: 12px;
    }

    .result-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;

        margin-top: 28px;
    }

    .result-box {
        background: #f2f4f7;
        border: 1px solid #e1e4e9;
        border-radius: 9px;
        padding: 15px;
    }

    .result-box span {
        display: block;
        color: #657083;
        font-size: 12px;
        margin-bottom: 7px;
    }

    .result-box strong {
        font-size: 16px;
        color: #172033;
    }

    .low-text {
        color: #17763d !important;
    }

    .medium-text {
        color: #9a6400 !important;
    }

    .high-text {
        color: #b52b2b !important;
    }


    /* REASONS */

    .reasons {
        margin-top: 25px;
    }

    .reasons h4 {
        margin: 0 0 12px;
        color: #172033;
    }

    .reason {
        display: flex;
        align-items: center;
        gap: 10px;

        margin-top: 8px;
        padding: 11px;

        background: #fff4f4;
        border: 1px solid #f1d1d1;
        border-radius: 8px;

        color: #7e3030;
        font-size: 13px;
    }

    .reason span {
        width: 22px;
        height: 22px;

        flex-shrink: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        border-radius: 50%;

        background: #e9bebe;
        color: #711d1d;
        font-weight: 800;
    }

    .safe {
        padding: 12px;

        background: #eaf7ef;
        border: 1px solid #c8e8d2;
        border-radius: 8px;

        color: #176b38;
        font-size: 13px;
        font-weight: 700;
    }


    /* WAITING */

    .waiting-card {
        min-height: 360px;

        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        text-align: center;
        padding: 30px;
    }

    .waiting-icon {
        width: 54px;
        height: 54px;

        display: flex;
        align-items: center;
        justify-content: center;

        background: #edf0f5;
        border-radius: 50%;

        color: #5364c7;
        font-size: 24px;
        font-weight: 800;

        margin-bottom: 15px;
    }

    .waiting-card p {
        max-width: 320px;
        color: #687386;
        font-size: 13px;
        line-height: 1.6;
    }


    /* DASHBOARD */

    .dashboard {
        background: #e9edf3;
        padding-bottom: 65px;
    }

    .dashboard-title {
        display: flex;
        justify-content: space-between;
        align-items: end;
    }

    .refresh-button {
        padding: 10px 16px;

        background: #ffffff;
        border: 1px solid #ccd2dc;
        border-radius: 8px;

        color: #344054;
        font-weight: 700;
        cursor: pointer;
    }

    .refresh-button:hover {
        background: #f7f8fa;
    }


    /* STATS */

    .stats {
        padding: 0 7%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 18px;
        margin-bottom: 25px;
    }

    .stat {
        background: #ffffff;
        border: 1px solid #dfe3ea;
        border-radius: 12px;
        padding: 22px;

        box-shadow: 0 3px 12px rgba(20, 30, 50, 0.04);
    }

    .stat span {
        display: block;
        color: #657083;
        font-size: 13px;
    }

    .stat strong {
        display: block;
        color: #172033;
        font-size: 30px;
        margin-top: 7px;
    }

    .low-stat {
        border-top: 3px solid #1b9b52;
    }

    .medium-stat {
        border-top: 3px solid #d38a00;
    }

    .high-stat {
        border-top: 3px solid #c93232;
    }


    /* TABLE */

    .table-card {
        margin: 0 7%;
        overflow: hidden;
    }

    .table-header {
        padding: 22px 25px;
        border-bottom: 1px solid #e1e4e9;
    }

    .table-header h3 {
        margin: 0 0 5px;
        color: #172033;
    }

    .table-header p {
        margin: 0;
        color: #687386;
        font-size: 13px;
    }

    .table-wrapper {
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th,
    td {
        padding: 15px 20px;
        text-align: left;
        border-bottom: 1px solid #edf0f3;
        white-space: nowrap;
        font-size: 13px;
    }

    th {
        background: #f7f8fa;
        color: #5e697b;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    td {
        color: #344054;
    }

    .badge {
        display: inline-block;
        padding: 5px 9px;
        border-radius: 20px;
        font-size: 10px;
        font-weight: 800;
    }

    .badge-low {
        background: #dcf5e5;
        color: #176b38;
    }

    .badge-medium {
        background: #fff0c9;
        color: #875800;
    }

    .badge-high {
        background: #fde0e0;
        color: #9e2525;
    }

    .action {
        color: #344054;
        font-weight: 700;
    }

    .no-users {
        padding: 50px;
        text-align: center;
        color: #697487;
        font-size: 14px;
    }


    /* HOW IT WORKS */

    .how {
        background: #ffffff;
    }

    .centered {
        text-align: center;
        max-width: 680px;
        margin-left: auto;
        margin-right: auto;
    }

    .steps {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 18px;
    }

    .step {
        padding: 24px;
        border: 1px solid #dfe3ea;
        border-radius: 12px;
    }

    .step > span {
        color: #5364c7;
        font-size: 12px;
        font-weight: 800;
    }

    .step h3 {
        color: #172033;
        margin: 18px 0 9px;
    }

    .step p {
        margin: 0;
        color: #687386;
        font-size: 13px;
        line-height: 1.6;
    }


    /* RISK INFO */

    .risk-info {
        margin-top: 30px;
        padding: 25px;

        background: #f5f6f8;
        border: 1px solid #dfe3ea;
        border-radius: 12px;
    }

    .risk-info h3 {
        margin-top: 0;
        color: #172033;
    }

    .risk-levels {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
    }

    .risk-levels div {
        padding: 18px;
        background: #ffffff;
        border: 1px solid #dfe3ea;
        border-radius: 9px;
    }

    .risk-levels strong,
    .risk-levels span,
    .risk-levels small {
        display: block;
    }

    .risk-levels strong {
        font-size: 14px;
    }

    .risk-levels span {
        color: #172033;
        font-size: 20px;
        font-weight: 800;
        margin: 7px 0;
    }

    .risk-levels small {
        color: #687386;
    }


    /* FOOTER */

    footer {
        padding: 28px 7%;

        background: #172033;
        color: #c3cad6;

        display: flex;
        justify-content: space-between;
        gap: 20px;

        font-size: 12px;
    }

    footer strong {
        color: #ffffff;
    }


    /* MOBILE */

    @media (max-width: 950px) {

        .signup-grid {
            grid-template-columns: 1fr;
        }

        .stats {
            grid-template-columns: 1fr 1fr;
        }

        .steps {
            grid-template-columns: 1fr 1fr;
        }

    }


    @media (max-width: 600px) {

        .header {
            padding: 0 5%;
        }

        .system-status {
            display: none;
        }

        .hero,
        .section {
            padding-left: 5%;
            padding-right: 5%;
        }

        .stats {
            padding: 0 5%;
            grid-template-columns: 1fr;
        }

        .table-card {
            margin-left: 5%;
            margin-right: 5%;
        }

        .dashboard-title {
            align-items: flex-start;
            flex-direction: column;
            gap: 15px;
        }

        .steps,
        .risk-levels {
            grid-template-columns: 1fr;
        }

        footer {
            padding-left: 5%;
            padding-right: 5%;
            flex-direction: column;
        }

    }

</style>
