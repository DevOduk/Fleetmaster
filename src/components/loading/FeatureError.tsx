import VpnLockOutlinedIcon from "@mui/icons-material/VpnLockOutlined";

interface FeatureErrorProps {
    status?: string;
    icon: any;
    title?: string;
    description: string;
}
function FeatureError({status = '404', icon, title = 'FEATURE COMING SOON', description}: FeatureErrorProps) {
  return (
    <div>
      
      <div className="mt-10 flex min-h-[75vh] flex-col items-center justify-center gap-4 text-[10px] text-red-300 dark:text-red-700">
        <VpnLockOutlinedIcon fontSize="large" className="text-3xl" />
        <p className="font-medium tracking-[0.2em] text-red-400 uppercase dark:text-red-600">
          Status: {status}
        </p>
        <p className="font-medium text-lg tracking-[0.2em] text-red-400 uppercase dark:text-red-600">
          {title}
        </p>
        <p className="max-w-4xl text-sm text-gray-500 text-center md:text-left p-2">{description}
        </p>
      </div>
    </div>
  )
}

export default FeatureError
