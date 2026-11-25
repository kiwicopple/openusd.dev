import { NativeSelect, NativeSelectOption } from './ui/native-select'
interface Props { tasks: Record<string,string>; providers: {id:string;name:string}[]; networks: string[]; access: Record<string,string> }
export default function DirectoryFilters({tasks,providers,networks,access}:Props) {
 return <form className="filters" id="filters" aria-label="Filter activities">
  <div><label htmlFor="task">Task</label><NativeSelect id="task" name="task" defaultValue=""><NativeSelectOption value="">All tasks</NativeSelectOption>{Object.entries(tasks).map(([id,label])=><NativeSelectOption key={id} value={id}>{label}</NativeSelectOption>)}</NativeSelect></div>
  <div><label htmlFor="provider">Provider</label><NativeSelect id="provider" name="provider" defaultValue=""><NativeSelectOption value="">All providers</NativeSelectOption>{providers.map(p=><NativeSelectOption key={p.id} value={p.id}>{p.name}</NativeSelectOption>)}</NativeSelect></div>
  <div><label htmlFor="access">Access</label><NativeSelect id="access" name="access" defaultValue=""><NativeSelectOption value="">All access</NativeSelectOption>{Object.entries(access).map(([id,label])=><NativeSelectOption key={id} value={id}>{label}</NativeSelectOption>)}</NativeSelect></div>
  <div><label htmlFor="network">Network</label><NativeSelect id="network" name="network" defaultValue=""><NativeSelectOption value="">All networks</NativeSelectOption>{networks.map(n=><NativeSelectOption key={n} value={n}>{n}</NativeSelectOption>)}<NativeSelectOption value="unknown">Unconfirmed networks</NativeSelectOption></NativeSelect></div>
  <div className="network-options"><label className="checkbox-label"><input type="checkbox" name="includeUnknown" aria-describedby="network-help" defaultChecked /> Include unconfirmed networks</label><small id="network-help">With a network selected, also show activities whose OUSD networks need confirmation. Filters match a product path within each activity.</small></div>
 </form>
}
