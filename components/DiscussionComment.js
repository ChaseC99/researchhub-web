import { Fragment } from "react";

import { css, StyleSheet } from "aphrodite";
import Router from "next/router";
import { connect } from "react-redux";

import DiscussionCard from "~/components/DiscussionCard";
import { ReplyEditor } from "~/components/DiscussionCommentEditor";
import DiscussionPostMetadata from "~/components/DiscussionPostMetadata";
import EditAction from "~/components/EditAction";
import TextEditor from "~/components/TextEditor";
import VoteWidget from "~/components/VoteWidget";

import DiscussionActions from "~/redux/discussion";

import { UPVOTE, DOWNVOTE } from "../config/constants";
import { discussionPageColors } from "~/config/themes/colors";
import { createUsername, doesNotExist, getNestedValue } from "~/config/utils";

class DiscussionComment extends React.Component {
  state = {
    id: this.props.data.id,
    date: this.props.data.createdDate,
    text: this.props.data.text,
    selectedVoteType: this.props.data.userVote.voteType,
    score: this.props.data.score,
    username: createUsername(this.props.data),
    readOnly: true,
  };

  componentDidUpdate(prevProps, prevState) {
    const selectedVoteType = getNestedValue(this.props, [
      "data",
      "userVote",
      "voteType",
    ]);
    if (selectedVoteType !== prevState.selectedVoteType) {
      this.setState({ selectedVoteType });
      // Force reset the replies so that they re-render
      this.setState({ replies: this.props.data.replies });
    }
  }

  setReadOnly = (readOnly) => {
    this.setState({ readOnly });
  };

  updateComment = async (text) => {
    const body = {
      text,
    };

    DiscussionActions.updateCommentPending();
    await DiscussionActions.updateComment(
      paperId,
      discussionThreadId,
      commentId,
      replyId,
      body
    );

    const comment = this.props.updatedComment;
    const success = comment.success || false;

    if (success) {
      this.setState({ text: comment.text });
    }
  };

  upvote = async () => {
    const { paperId, discussionThreadId } = Router.query;

    this.props.dispatch(DiscussionActions.postUpvotePending());

    const ids = [];
    if (this.props.commentId) {
      ids.push(this.props.commentId);
    }
    ids.push(this.state.id);

    await this.props.dispatch(
      DiscussionActions.postUpvote(paperId, discussionThreadId, ...ids)
    );

    this.updateWidgetUI(this.props.voteResult);
  };

  downvote = async () => {
    const { paperId, discussionThreadId } = Router.query;

    this.props.dispatch(DiscussionActions.postDownvotePending());

    const ids = [];
    if (this.props.commentId) {
      ids.push(this.props.commentId);
    }
    ids.push(this.state.id);

    await this.props.dispatch(
      DiscussionActions.postDownvote(paperId, discussionThreadId, ...ids)
    );

    this.updateWidgetUI(this.props.voteResult);
  };

  updateWidgetUI = (voteResult) => {
    const vote = getNestedValue(voteResult, ["vote"], false);
    if (vote) {
      const voteType = vote.voteType;
      if (voteType === UPVOTE) {
        this.setState({ selectedVoteType: UPVOTE });
      } else if (voteType === DOWNVOTE) {
        this.setState({ selectedVoteType: DOWNVOTE });
      }
    }
  };

  renderTop = () => {
    return (
      <Fragment>
        <VoteWidget
          score={this.state.score}
          onUpvote={this.upvote}
          onDownvote={this.downvote}
          selected={this.state.selectedVoteType}
        />
        <DiscussionPostMetadata
          username={this.state.username}
          date={this.state.date}
        />
      </Fragment>
    );
  };

  renderInfo = () => {
    return (
      <TextEditor
        classNames={[styles.commentEditor]}
        readOnly={this.state.readOnly}
        onSubmit={this.updateComment}
        initialValue={this.state.text}
      />
    );
  };

  render() {
    const action = this.renderAction ? this.renderAction() : null;

    return (
      <div className={css(styles.commentContainer)}>
        <DiscussionCard
          top={this.renderTop()}
          info={this.renderInfo()}
          infoStyle={this.props.infoStyle}
          action={action}
        />
      </div>
    );
  }
}

class CommentClass extends DiscussionComment {
  constructor(props) {
    super(props);
    this.state.showReplyBox = false;
    this.state.replies = this.props.data.replies;
    this.state.replyCount = this.props.data.replyCount;
  }

  renderAction = () => {
    return (
      <div className={css(styles.actionBar)}>
        {!this.state.showReplyBox
          ? this.renderReplyButton()
          : this.renderReplyBox()}
        <EditAction onClick={this.setReadOnly} />
        {this.renderReplies()}
      </div>
    );
  };

  renderReplyButton = () => {
    return (
      <a className={css(styles.reply)} onClick={this.showReplyBox}>
        Reply
      </a>
    );
  };

  showReplyBox = () => {
    this.setState({ showReplyBox: true });
  };

  renderReplyBox = () => {
    return (
      <ReplyEditor
        onSubmit={this.addSubmittedReply}
        commentId={this.state.id}
      />
    );
  };

  addSubmittedReply = (reply) => {
    if (!doesNotExist(reply)) {
      let newReplies = [reply];
      newReplies = newReplies.concat(this.state.replies);
      this.setState({ replies: newReplies });
    }
  };

  renderReplies = () => {
    const replies = this.state.replies.map((r, i) => {
      return <Reply key={r.id} data={r} commentId={this.state.id} />;
    });

    return (
      <Fragment>
        <div>{this.state.replyCount} Replies</div>
        {replies}
      </Fragment>
    );
  };
}

class ReplyClass extends DiscussionComment {
  constructor(props) {
    super(props);
  }
}

const mapStateToProps = (state) => {
  return {
    voteResult: state.discussion.voteResult,
  };
};

export const Comment = connect(
  mapStateToProps,
  null
)(CommentClass);

export const Reply = connect(
  mapStateToProps,
  null
)(ReplyClass);

const styles = StyleSheet.create({
  commentContainer: {
    padding: "32px 0px 36px 0px",
  },
  commentEditor: {
    minHeight: "100%",
    padding: "0px",
  },
  voteWidget: {
    marginRight: 18,
  },
  actionBar: {
    marginTop: 8,
    width: "100%",
  },
  reply: {
    cursor: "pointer",
  },
  divider: {
    borderBottom: "1px solid",
    display: "block",
    borderColor: discussionPageColors.DIVIDER,
  },
});
