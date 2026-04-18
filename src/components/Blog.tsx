import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const posts = [
  {
    date: "Apr 12, 2026",
    title: "Why I love building with CSS Grid",
    desc: "A look at how Grid changed the way I think about layouts and what I learned along the way.",
    readTime: "4 min read",
  },
  {
    date: "Mar 28, 2026",
    title: "Smooth animations without the bloat",
    desc: "Using Framer Motion and CSS to build delightful interactions that still feel fast.",
    readTime: "6 min read",
  },
  {
    date: "Mar 10, 2026",
    title: "My first 3D scene with Three.js",
    desc: "Notes from a beginner trying to bring depth and motion to a static portfolio.",
    readTime: "5 min read",
  },
];

const Blog = () => {
  return (
    <section id="blog" className="relative py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mb-14"
        >
          <p className="text-sm font-medium text-primary-glow tracking-widest uppercase mb-3">
            Blog
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold">
            Notes & <span className="text-gradient">thoughts</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group flex flex-col rounded-2xl glass p-6 shadow-soft transition-smooth hover:shadow-elegant glow-border"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <Calendar className="h-3.5 w-3.5" />
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h3 className="font-display text-xl font-bold mb-3 leading-snug group-hover:text-gradient transition-smooth">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-6 flex-1">{post.desc}</p>
              <Button variant="link" size="sm" className="self-start px-0 text-primary-glow">
                Read more <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
