import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/UserContext";
import { useParams } from "react-router-dom";
import { format, formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    fetch(`/api/blogs/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setPostInfo(postInfo.data);
      });
    });
  }, []);

  if (!postInfo) return "";

  const isAuthor =
    userInfo?.id?.toString() === postInfo?.author?._id?.toString();

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <time>{format(new Date(postInfo.createdAt), "MMMM d, yyyy h:mm a")}</time>
      <div className="author">
        by @{postInfo.author.first_name} {postInfo.author.last_name}
      </div>

      {isAuthor && (
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
            Edit this post
          </Link>
          <div className="author">
            <p> {postInfo.state}</p>
          </div>
        </div>
      )}
      <div className="image">
        <img src={postInfo.image} alt="" />
      </div>
      <span>
        {postInfo.tags.map((tag) => (
          <span key={tag.name} className="blog-tag">
            #{tag.name}
          </span>
        ))}
      </span>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.body }}
      />
    </div>
  );
}
