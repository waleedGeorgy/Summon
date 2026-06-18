import AgentTabs from "./_components/AgentTabs"
import CreateAgentDialog from "./_components/CreateAgentDialog"

const DashboardPage = () => {
    return (
        <div className="space-y-10">
            <CreateAgentDialog />
            <AgentTabs />
        </div>
    )
}

export default DashboardPage