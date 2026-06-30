import CreateWorkflowDialog from "./_components/CreateWorkflowDialog"
import WorkflowsTabs from "./_components/WorkflowsTabs"

const DashboardPage = () => {
    return (
        <div className="space-y-10">
            <CreateWorkflowDialog />
            <WorkflowsTabs />
        </div>
    )
}

export default DashboardPage