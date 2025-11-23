import { authOptions } from "@/lib/auth-option";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from 'next-auth'
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {

      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
   .middleware(async () => {
			const token = await getServerSession(authOptions)
			if (!token) throw new UploadThingError('Unauthorized')
			return { token }
		})
    .onUploadComplete(async ({  metadata,file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.token?.user?.email);

      console.log("file url", file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.token?.user?.email, fileUrl: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;


