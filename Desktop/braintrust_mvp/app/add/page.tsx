import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ManualEntryForm } from '@/components/documents/manual-entry-form'
import { FileUploadZone } from '@/components/documents/file-upload-zone'
import { ProfileCheck } from '@/components/profile/profile-check'

export default function AddPage() {
  return (
    <ProfileCheck>
      <div className="container max-w-2xl mx-auto py-8">
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Write Entry</TabsTrigger>
            <TabsTrigger value="upload">Upload File</TabsTrigger>
          </TabsList>
          <TabsContent value="manual">
            <ManualEntryForm />
          </TabsContent>
          <TabsContent value="upload">
            <FileUploadZone />
          </TabsContent>
        </Tabs>
      </div>
    </ProfileCheck>
  )
}
