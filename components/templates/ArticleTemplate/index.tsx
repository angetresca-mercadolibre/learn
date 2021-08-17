import Button from '@components/atoms/Button'
import CollectionView from '@components/atoms/CollectionView'
import EmbeddedYoutubeVideo from '@components/atoms/EmbeddedYoutubeVideo'
import GifLikeVideo from '@components/atoms/GifLikeVideo'
import SourcegraphSearch from '@components/atoms/SourcegraphSearch'
import TocWrapper from '@components/atoms/TocWrapper'
import { MetaTags } from '@components/layouts/Layout'
import PageLayout from '@components/layouts/PageLayout'
import RecordCollection from '@interfaces/RecordCollection'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { FunctionComponent } from 'react'

import {
    StyledHeaderImage,
    StyledAuthorByline,
    StyledTagsWrapper,
    StyledMarkdownWrapper,
} from './ArticleTemplateStyles'

export interface Props {
    title: string
    author?: string | null
    tags: string[]
    mdxSource: MDXRemoteSerializeResult
    image?: string | null
    imageAlt?: string | null
    socialImage?: string | null
    description?: string | null
    toc?: string[] | null
    collection?: RecordCollection | null
    slug: string
    alternateTitle?: string | null
    initialSearchResults?: SearchResults | null
}

interface SearchResults extends Array<ResultsArray> {
    results: ResultsArray | undefined
}

interface ResultsObject {
    typeName: string
    repository: RepositoryMatch
    file: FileMatch
    lineMatches: Node
}

interface ResultsArray extends Array<ResultsObject> {
    [key: number]: ResultsObject
}

interface RepositoryMatch {
    repository: Node
}

interface FileMatch {
    file: Node
}

const components = { SourcegraphSearch, EmbeddedYoutubeVideo, GifLikeVideo, CollectionView }

const ArticleTemplate: FunctionComponent<Props> = props => {
    const metaTags: MetaTags = {
        image: props.socialImage ?? props.image,
        description: props.description,
        type: 'article',
    }

    // Special behavior on a video page (which is a page with the "video" tag):
    // We don't show the post header image because it's just the thumbnail.
    // The image will still be shown on the post's card and in social sharing.
    // TODO: We can improve this by adding a `showImageInHeader` field in markdown front-matter
    // to be able to override this special behavior.
    const showHeaderImage = !props.tags.includes('video')

    // The alternate title, if present, is used for the document title and it omits the site title suffix.
    const documentTitle = props.alternateTitle || props.title
    const appendSiteTitle = !props.alternateTitle
    const results: ResultsArray | undefined = props.initialSearchResults?.results
    console.log(repo)

    return (
        <PageLayout
            documentTitle={documentTitle}
            appendSiteTitle={appendSiteTitle}
            metaTags={metaTags}
            leftColumn={props.toc && (
                <>
                    <TocWrapper tocContents={props.toc} slug={props.slug} />
                </>
            )}
        >
            {/* Header image */}
            {props.image && showHeaderImage && (
                <StyledHeaderImage src={props.image} alt={props.imageAlt ? props.imageAlt : ''} />
            )}

            {/* Title and author */}
            <h1>{props.title}</h1>
            {props.author && <StyledAuthorByline>By {props.author}</StyledAuthorByline>}

            {/* Tags list */}
            {props.tags.length > 0 ? (
                <StyledTagsWrapper>
                    {props.tags.map(tag => (
                        <Button key={tag} href={`/tags/${tag}`} className='extra-small'>
                            {tag}
                        </Button>
                    ))}
                </StyledTagsWrapper>
            ) : null}

            {props.collection && (
                <CollectionView
                    title={props.collection.title}
                    members={props.collection.members}
                    activeSlug={props.slug}
                />
            )}

            <StyledMarkdownWrapper>
                <MDXRemote {...props.mdxSource} components={components} />
            </StyledMarkdownWrapper>
        </PageLayout>
    )
}

export default ArticleTemplate
