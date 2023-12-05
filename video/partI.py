from manim import *

def compEdges(nodes, edges):
    return [Arrow(nodes[i].get_center(), nodes[j].get_center(), color=BLACK, max_tip_length_to_length_ratio=0, buff=0.5) for (i, j) in edges]


class DistributedAlgorithms(Scene):

    def construct(self):
        self.camera.background_color = "#F9F2E5"
        
        nodes = [Dot(color=BLACK, radius=0.3), Dot(point=3*RIGHT+2*UP, color=BLACK, radius=0.3), Dot(point=3*RIGHT+2*DOWN, color=BLACK, radius=0.3), Dot(point=4*LEFT, color=BLACK, radius=0.3)]
        edges = [(0, 1), (0, 2), (1,2), (0,3)]
        edges = compEdges(nodes, edges)

        edgesGroup = VGroup(*edges)
        packet = Dot(color=YELLOW).move_to(nodes[0].get_center())

        text0 = Text("I. DISTRIBUTED ALGORITHMS", color=BLACK, font="DejaVu Sans Mono").scale(0.7)
        #text1 = Text("Let's hold an election!", color=BLACK, font="DejaVu Sans Mono").scale(0.4).shift(UP*2 + LEFT*2)
        #text2 = Text("All 5 nodes will designate a KING node.", color=BLACK, font="DejaVu Sans Mono", 
        #                t2c={"KING": RED}).scale(0.4).shift(UP*1.5 + LEFT)

        text1 = Text("This is a NETWORK", color=BLACK, font="DejaVu Sans Mono").scale(0.5).move_to(4*LEFT+2*UP)
        text4 = Text("This is a GEOMETRICAL NETWORK", color=BLACK, font="DejaVu Sans Mono").scale(0.4).move_to(3*LEFT+2*UP)

        text2 = Text("Each NODE is its own processor", color=RED_E, font="DejaVu Sans Mono").scale(0.4).move_to(4*LEFT+2*DOWN)
        text3 = Text("NODES can only communicate with NEIGHBORS", color=BLUE_E, font="DejaVu Sans Mono").scale(0.4).move_to(4*LEFT+2.5*DOWN)
        
        text5 = Text("The network is PLANAR", color=GREEN_E, font="DejaVu Sans Mono").scale(0.4).move_to(4*LEFT+2*DOWN)
        text6 = Text("NODES represent a POINT in Euclidean Space", color=RED_E, font="DejaVu Sans Mono").scale(0.4).move_to(4*LEFT+2.5*DOWN)

        sndText = VGroup(*[text2, text3]).arrange(DOWN, center=False, aligned_edge=LEFT)
        thrdText=VGroup(*[text5, text6]).arrange(DOWN, center=False, aligned_edge=LEFT)

        myNode = Dot(color=RED, radius=0.2, point=3*RIGHT+2*DOWN)
        neighbors = [Dot(color=GREEN, radius=0.2, point=3*RIGHT+2*UP), Dot(color=GREEN, radius=0.2)]
        arrows    = [Arrow(myNode.get_center(), n.get_center(), color=BLUE, max_tip_length_to_length_ratio=0.5, buff=0.4) for n in neighbors]
        otherway = [Arrow(n.get_center(), myNode.get_center(), color=BLUE, max_tip_length_to_length_ratio=0.5, buff=0.4) for n in neighbors]
        #packet = Dot(color=RED, radius=0.2, point=nodes[0].get_center())

        tex0 = Tex(r"$(3, -2)$", font_size=100, color=BLACK).scale(0.3).move_to(3*RIGHT + 2.5*DOWN)
        tex1 = Tex(r"$(0, 0)$", font_size=100, color=BLACK).scale(0.3).move_to(0.5*DOWN)
        tex2 = Tex(r"$(3, 2)$", font_size=100, color=BLACK).scale(0.3).move_to(3*RIGHT + 2.5*UP)
        tex3 = Tex(r"$(-4, 0)$", font_size=100, color=BLACK).scale(0.3).move_to(4*LEFT + 0.5*DOWN)

        coords = VGroup(*[tex0, tex1, tex2, tex3])

        self.play(Create(text0))
        self.wait(1)
        self.play(FadeOut(text0))
        self.wait(1)

        Animation = [FadeIn(n) for n in nodes]
        self.play(*Animation)

        #self.play(GrowFromCenter(nodesGroup))
        self.wait(0.5)
        self.play(Create(edgesGroup))
        self.wait(0.5)
        self.play(Create(text1))
        self.wait(0.5)
        self.play(Flash(myNode))
        self.play(FadeIn(myNode))
        self.wait(1)
        self.play(*[FadeIn(n) for n in neighbors])
        self.play(Create(sndText))
        self.wait(0.5)
        self.play(*[GrowArrow(x) for x in arrows])
        self.wait(1)
        self.play(*[FadeOut(x) for x in arrows])
        self.play(*[GrowArrow(x) for x in otherway])
        self.wait(1.5)
        self.play(*[FadeOut(x) for x in otherway])
        self.play(*[FadeOut(n) for n in neighbors])
        self.play(Uncreate(sndText))
        self.wait(0.5)
        self.play(Uncreate(text1))
        self.play(Create(coords))
        self.play(Create(text4))
        self.play(Create(thrdText))
        self.play(*([ScaleInPlace(n, 0.5) for n in nodes] + [ScaleInPlace(myNode, 0.5)]))
        self.wait(5)

        self.play(Uncreate(thrdText))
        self.play(Uncreate(text4))
        self.play(FadeOut(coords))
        self.play(*([FadeOut(n) for n in nodes] + [FadeOut(myNode)]))
        self.play(Uncreate(edgesGroup))
        self.wait(5)
