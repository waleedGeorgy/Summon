import AgentTabs from "./_components/AgentTabs"
import CreateAgentDialog from "./_components/CreateAgentDialog"

const DashboardPage = () => {
    return (
        <div className="gap-10 flex flex-col justify-center">
            <CreateAgentDialog />
            <AgentTabs />
        </div>
    )
}

export default DashboardPage