import { useState, useEffect } from "react";
import { MessageSquare, Heart, Share2, MoreVertical, Plus, Loader2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "motion/react";
import { Translate } from "../contexts/LanguageContext";
import { auth, db } from "@/firebase";
import { cn } from "@/lib/utils";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  where
} from "firebase/firestore";
import { toast } from "sonner";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function Community() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState("All");

  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().createdAt?.toDate() || new Date()
      }));
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "posts");
    });

    return () => unsubscribe();
  }, []);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    if (!auth.currentUser) {
      toast.error("You must be logged in to post");
      return;
    }
    
    try {
      await addDoc(collection(db, "posts"), {
        authorUid: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || "Anonymous Farmer",
        authorPhoto: auth.currentUser.photoURL || "",
        content: newPostContent,
        createdAt: serverTimestamp(),
        likesCount: 0,
        commentsCount: 0,
        tag: selectedTag === "All" ? "General" : selectedTag
      });
      setNewPostContent("");
      setIsDialogOpen(false);
      toast.success("Post shared with community!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "posts");
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        likesCount: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `posts/${postId}`);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!newComment.trim() || !auth.currentUser) return;

    try {
      await addDoc(collection(db, `posts/${postId}/comments`), {
        authorUid: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || "Anonymous Farmer",
        authorPhoto: auth.currentUser.photoURL || "",
        content: newComment,
        createdAt: serverTimestamp()
      });

      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        commentsCount: increment(1)
      });

      setNewComment("");
      setCommentingOn(null);
      toast.success("Comment added!");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `posts/${postId}/comments`);
    }
  };

  const fetchComments = (postId: string) => {
    if (comments[postId]) return;

    const q = query(collection(db, `posts/${postId}/comments`), orderBy("createdAt", "asc"));
    onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().createdAt?.toDate() || new Date()
      }));
      setComments(prev => ({ ...prev, [postId]: commentsData }));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `posts/${postId}/comments`);
    });
  };

  const filteredPosts = selectedTag === "All" 
    ? posts 
    : posts.filter(post => post.tag === selectedTag);

  return (
    <div className="space-y-6">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#5A5A40]"><Translate>Farmer Community</Translate></h2>
          <p className="text-gray-500 text-sm md:text-base"><Translate>Connect, share, and learn from fellow farmers across the country.</Translate></p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger
            render={
              <Button className="bg-[#5A5A40] hover:bg-[#4A4A30] rounded-2xl h-12 px-6 shadow-lg shadow-[#5A5A40]/20">
                <Plus className="w-5 h-5 mr-2" />
                <Translate>Create New Post</Translate>
              </Button>
            }
          />
          <DialogContent className="sm:max-w-[525px] rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-[#5A5A40]"><Translate>Create Post</Translate></DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full h-40 p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 text-lg"
              />
              <div className="flex flex-wrap gap-2">
                {["General", "Disease Help", "Market News", "Success Story", "Government Schemes"].map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    onClick={() => setSelectedTag(tag)}
                    className={cn(
                      "cursor-pointer px-3 py-1 rounded-full",
                      selectedTag === tag ? "bg-[#5A5A40]" : "hover:bg-[#5A5A40]/5"
                    )}
                  >
                    <Translate>{tag}</Translate>
                  </Badge>
                ))}
              </div>
              <Button 
                onClick={handleCreatePost} 
                className="w-full bg-[#5A5A40] hover:bg-[#4A4A30] rounded-2xl h-14 text-lg font-bold shadow-lg shadow-[#5A5A40]/20 mt-4"
                disabled={!newPostContent.trim()}
              >
                <Translate>Post to Community</Translate>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar sticky top-20 z-30 bg-[#F8F9F5]/80 backdrop-blur-sm py-2">
            {["All", "Disease Help", "Market News", "Success Story", "Government Schemes"].map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                onClick={() => setSelectedTag(tag)}
                className={`whitespace-nowrap rounded-full px-5 py-2 transition-all cursor-pointer font-bold ${
                  selectedTag === tag 
                    ? "bg-[#5A5A40] text-white border-[#5A5A40] shadow-md shadow-[#5A5A40]/20" 
                    : "bg-white border-gray-100 text-gray-500 hover:bg-[#5A5A40] hover:text-white"
                }`}
              >
                <Translate>{tag}</Translate>
              </Badge>
            ))}
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-[#5A5A40]" />
                <p className="text-gray-400 font-medium"><Translate>Loading community feed...</Translate></p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-400"><Translate>No posts found</Translate></h4>
                <p className="text-sm text-gray-300 mt-1"><Translate>Be the first to share something with the community!</Translate></p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <Card key={post.id} className="border-none shadow-sm bg-white overflow-hidden rounded-3xl hover:shadow-md transition-all group">
                  <CardHeader className="p-6 pb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 border-2 border-white shadow-sm ring-2 ring-gray-50">
                          <AvatarImage src={post.authorPhoto || `https://picsum.photos/seed/${post.authorUid}/100/100`} />
                          <AvatarFallback className="bg-[#5A5A40] text-white">{post.authorName?.[0] || "F"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-black text-[#5A5A40]">{post.authorName}</h4>
                          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-0.5">
                            {post.timestamp ? post.timestamp.toLocaleDateString() : <Translate>Just now</Translate>}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-gray-300 hover:text-[#5A5A40] rounded-full">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-4">
                    <Badge variant="secondary" className="bg-[#5A5A40]/5 text-[#5A5A40] border-none rounded-full text-[10px] uppercase tracking-[0.2em] px-3 py-1 font-black">
                      <Translate>{post.tag}</Translate>
                    </Badge>
                    <p className="text-gray-700 leading-relaxed text-lg"><Translate>{post.content}</Translate></p>
                    {post.image && (
                      <div className="rounded-3xl overflow-hidden border border-gray-50 shadow-inner">
                        <img src={post.image} alt="Post" className="w-full h-auto object-cover max-h-[500px]" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex gap-8">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-all group/like"
                        >
                          <div className="p-2 rounded-full group-hover/like:bg-red-50 transition-colors">
                            <Heart className="w-6 h-6" />
                          </div>
                          <span className="text-sm font-black">{post.likesCount || 0}</span>
                        </button>
                        <button 
                          onClick={() => {
                            if (commentingOn === post.id) {
                              setCommentingOn(null);
                            } else {
                              setCommentingOn(post.id);
                              fetchComments(post.id);
                            }
                          }}
                          className="flex items-center gap-2 text-gray-400 hover:text-[#5A5A40] transition-all group/comment"
                        >
                          <div className="p-2 rounded-full group-hover/comment:bg-[#5A5A40]/5 transition-colors">
                            <MessageSquare className="w-6 h-6" />
                          </div>
                          <span className="text-sm font-black">{post.commentsCount || 0}</span>
                        </button>
                      </div>
                      <button className="p-2 rounded-full text-gray-400 hover:text-[#5A5A40] hover:bg-[#5A5A40]/5 transition-all">
                        <Share2 className="w-6 h-6" />
                      </button>
                    </div>

                    <AnimatePresence>
                      {commentingOn === post.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pt-4 space-y-4"
                        >
                          <div className="space-y-3">
                            {comments[post.id]?.map((comment) => (
                              <div key={comment.id} className="flex gap-3 bg-gray-50 p-3 rounded-2xl">
                                <Avatar className="w-8 h-8 shrink-0">
                                  <AvatarImage src={comment.authorPhoto} />
                                  <AvatarFallback className="bg-[#5A5A40] text-white text-[10px]">{comment.authorName?.[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex justify-between items-center mb-1">
                                    <h5 className="text-xs font-black text-[#5A5A40]">{comment.authorName}</h5>
                                    <span className="text-[10px] text-gray-400">{comment.timestamp?.toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 leading-relaxed">{comment.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex gap-2 pt-2">
                            <Input
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Write a comment..."
                              className="rounded-xl border-gray-100 bg-gray-50 h-10 text-sm"
                              onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                            />
                            <Button 
                              size="sm" 
                              className="bg-[#5A5A40] hover:bg-[#4A4A30] rounded-xl px-4"
                              onClick={() => handleAddComment(post.id)}
                              disabled={!newComment.trim()}
                            >
                              <Translate>Reply</Translate>
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block space-y-8 sticky top-28">
          <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-black text-[#5A5A40]"><Translate>Community Stats</Translate></CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-gray-50 rounded-3xl text-center">
                  <p className="text-3xl font-black text-[#5A5A40]">1.2k</p>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1"><Translate>Farmers</Translate></p>
                </div>
                <div className="p-6 bg-gray-50 rounded-3xl text-center">
                  <p className="text-3xl font-black text-[#5A5A40]">450</p>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1"><Translate>Daily Posts</Translate></p>
                </div>
              </div>
              <div className="p-6 bg-gradient-to-br from-[#5A5A40] to-[#8A8A60] rounded-3xl text-white">
                <h5 className="font-bold mb-2"><Translate>Expert Advice</Translate></h5>
                <p className="text-xs text-white/80 leading-relaxed"><Translate>Get verified answers from agricultural scientists and experienced farmers.</Translate></p>
                <Button variant="secondary" className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white border-none rounded-xl font-bold">
                  <Translate>Ask an Expert</Translate>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-black text-[#5A5A40]"><Translate>Trending Topics</Translate></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["#OrganicFarming", "#WheatHarvest", "#MonsoonTips", "#SoilHealth", "#MarketRates", "#AgriTech"].map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-gray-50 text-gray-500 hover:bg-[#5A5A40] hover:text-white transition-all cursor-pointer px-4 py-2 rounded-full border-none font-bold">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

